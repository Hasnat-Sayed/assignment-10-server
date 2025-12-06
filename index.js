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
        const orderCollections = database.collection('orders');


        //post or add services to DB
        app.post('/services', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await petServices.insertOne(data);
            res.send(result)
        })

        // Get services from DB
        app.get('/services', async (req, res) => {
            const { category } = req.query
            console.log(category);
            const query = {}
            if (category) {
                query.category = category
            }
            const result = await petServices.find(query).toArray();
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

        //delete listing 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const result = await petServices.deleteOne(query)
            res.send(result)
        })

        //get latest 6
        app.get("/latest", async (req, res) => {
            const result = await petServices
                .find()
                .sort({ created_at: "desc" })
                .limit(6)
                .toArray();

            // console.log(result);

            res.send(result);
        });

        //get by category
        app.get('/category', async(req, res) => {
            const { category } = req.query;
            const query = { category: category }
            const result = await petServices.find(query).toArray();
            res.send(result)

        })

        //create order list
        app.post('/orders', async (req, res) => {
            const data = req.body
            console.log(data);
            const result = await orderCollections.insertOne(data)
            res.send(result)
        })


        //get orders
        app.get('/orders', async (req, res) => {
            const result = await orderCollections.find().toArray();
            res.status(200).send(result)
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
