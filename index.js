const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.96corz1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //database
    const db = client.db("artsDB");

    const subCollection = db.collection('subcategories')
    app.get('/subcategories', async(req, res) => {
      const result = await subCollection.find({}).toArray();
      res.send(result)
    })

    const craftsCollection = db.collection("crafts");
    const artCollection = db.collection("arts");
    // crafts
    app.get("/crafts", async (req, res) => {
      const result = await craftsCollection.find({}).toArray();
      res.send(result);
    });
    // arts
    app.get("/arts", async (req, res) => {
      const result = await artCollection.find({}).toArray();
      res.send(result);
    });

    // main section starts from here
    const addCrafts = db.collection("addCrafts");

    app.post("/addCraft", async (req, res) => {
      console.log(req.body);
      const result = await addCrafts.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    app.get("/myCraft/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await addCrafts
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/singleArt/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await addCrafts.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/updateArt/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          name: req.body.name,
          itemName: req.body.itemName,
          price: req.body.price,
          email: req.body.email,
          subcategory: req.body.subcategory,
          imageURL: req.body.imageURL,
          customization: req.body.customization,
          status: req.body.status,
          processingTime: req.body.processingTime,
          rating: req.body.rating,
          description: req.body.description,
        },
      };
      const result = await addCrafts.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const result = await addCrafts.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    const allCrafts = db.collection("addCrafts");
    app.get("/addCrafts", async (req, res) => {
      const result = await allCrafts.find({}).toArray();
      res.send(result);
    });

      // subcategory
    
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art and drawing server is running");
});

app.listen(port, () => {
  console.log(`art and drawing server is running on port: ${port}`);
});
