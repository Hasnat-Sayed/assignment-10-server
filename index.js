const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@first-cluster.xds9q0g.mongodb.net/?appName=first-cluster`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const database = client.db('petService');
        const petServices = database.collection('services');


        //post or add services to DB
        app.post('/services', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await petServices.insertOne(data);
            res.send(result)
        })

        // Get services from DB
        app.get('/services', async (req, res) => {
            const result = await petServices.find().toArray();
            res.send(result)
        })


        //service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await petServices.findOne(query)
            res.send(result);
        })

        //my listings
        app.get('/my-services', async (req, res) => {
            const { email } = req.query
            const query = { email: email }
            const result = await petServices.find(query).toArray()
            res.send(result)
        })


        //update listing
        app.put('/update/:id', async (req, res) => {
            const data = req.body;
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const updateServices = {
                $set: data
            }
            const result = await petServices.updateOne(query, updateServices)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello, Developers')
})
app.listen(port, () => {
    console.log(`server is running on ${port}`);
})
