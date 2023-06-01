const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('coffee maker server is running ');
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});



// database 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.7vupqqk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database name and collection 
    const coffeeCollection = client.db("coffeeShopDB").collection("coffee");




    //  add every client request in hear 

          // read operation 
          app.get('/addCoffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          })

          //specific read operation
          app.get('/addCoffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await coffeeCollection.findOne(query);
            res.send(result);
          })

          // update operation 
          app.put('/addCoffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const options = { upsert: true };
            const updateCoffee = req.body;
            console.log(updateCoffee);
            const newCoffee = {
              $set: {
                category: updateCoffee.category, 
                details: updateCoffee.details, 
                photoUrl: updateCoffee.photoUrl, 
                quantity: updateCoffee.quantity, 
                details: updateCoffee.details
              },
            };
            const result = await coffeeCollection.updateOne(filter, newCoffee, options);
            
            res.send(result);
          })

          // create operation 
          app.post('/addCoffee', async(req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
          })

          //delete operation
          app.delete('/addCoffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
          })
    // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
}
run().catch(console.dir);
