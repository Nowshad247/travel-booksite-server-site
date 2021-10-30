const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtjga.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//admin
//4KZhQCjefNU8Mx6L

async function run() {
    try {
        await client.connect();
        const database = client.db("happytravel");
        const travelservices = database.collection("services");
        const trip = database.collection("trip");
        const order = database.collection("order");
        //get all services 
        app.get('/services', async (req, res) => {
            const cursor = travelservices.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // get api trip
        app.get('/trip', async (req, res) => {
            const cursor = trip.find({});
            const tripResult = await cursor.toArray();
            res.send(tripResult);
        })
        // find one data and send 
        app.get('/package-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await travelservices.findOne(query);
            res.json(result);
        })
        // post api 
        app.post('/order', async (req, res) => {
            const orderdata = req.body;
            const result = await order.insertOne(orderdata);
            res.json(result);
        })
        //My Order list 
        app.get('/my-order-list/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { userid: uid };
            const cursor = order.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })
        //Delate order List
        app.delete('/my-rder-list/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await order.deleteOne(query);
            res.json(result);
        })
        // all orders 
        app.get('/all-orders', async (req, res) => {
            const cursor = order.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //update order 
        app.put('/all-orderss/:id/:status', async (req, res) => {
            const id = req.params.id;
            const status = req.params.status;
            const filter = { _id: ObjectId(id) };
            const result = await order.findOne(filter);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: status
                },
            };
            const results = await order.updateOne(result, updateDoc, options);
            res.json(results);
        })
        //add packages 
        app.post('/add-new-services', async (req, res) => {
            const data = req.body;
            const result = await travelservices.insertOne(data);
            res.json(result);
        })

    } finally {
        //  await client.close();
    }

}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('server is listenig ');
})
app.listen(port, () => {
    console.log('server runing', port)
})