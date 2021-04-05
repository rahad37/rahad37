const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001;

app.get('/', (req, res)=>{
  res.send('Hello From Heroku, It is working perfectly Boss...')
})
app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woq6p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connection Error', err);
  const productCollection = client.db("dailyShop").collection("products");
  const ordersCollection = client.db("dailyShop").collection("orders");


app.get('/products', (req, res)=>{
  productCollection.find()
  .toArray((err, items)=>{
    res.send(items)
    
  }) 
})


app.post('/addProduct', (req, res)=>{
  const newProduct = req.body;
  productCollection.insertOne(newProduct)
  .then(result =>{
    console.log('Inserted Count', result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})


app.post('/addOrder', (req, res)=>{
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result =>{
    res.send(result.insertedCount > 0)
  })
})

app.get('/allOrder', (req, res) =>{
  ordersCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
})
app.listen(process.env.PORT || port)