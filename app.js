const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv/config');


const api = process.env.API_URL

// Middleware 
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello API!!')
})

app.get(`${api}/products`, (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Product1',
    },
    {
      id: 1,
      name: 'Product1',
    }
  ]
  res.send({data: products})
})

app.post(`${api}/products`, (req, res) => {
  const body = req.body
  res.send(body)
})

app.listen(3000, () => {
  console.log('Server running http://localhost:3000');
})