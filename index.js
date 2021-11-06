const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//user: genius-car
//pw: 6hYkrSvzYfqQDKj4

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtojm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');

        //GET API

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET A SPECIFIC SERVICE

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        //POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting the post', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        //DELETE API

        app.delete('/services/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.listen(PORT, () => {
    console.log(`server is running at http://localhost:5000`);
})

app.get('/', (req, res) => {
    res.send('server is running');
})