const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const uuid = require('node-uuid')
const mongoose = require('mongoose');

const app = express();
require('dotenv/config');


const api = process.env.API_URL

// Access log
const fileAccessLog = path.join(__dirname, 'access.log');
const accessLogStream = fs.createWriteStream(fileAccessLog, { flags: 'a' });

// Middleware 
app.use(bodyParser.json());

morgan.token('id', function getId(req){
  return req.id
})

app.use(assignId)
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', {stream: accessLogStream}))

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
      id: 2,
      name: 'Product2',
    },
    {
      id: 3,
      name: 'Product3',
    }
  ]
  res.send({data: products})
})

app.post(`${api}/products`, (req, res) => {
  const body = req.body
  res.send(body)
})


mongoose.connect(process.env.CONNECTION_STRING, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop-database'
 }).then(() => {
  console.log('Database connection is ready...')
})
.catch((err) => {
  console.log(err)
})


app.listen(3000, () => {
  console.log('Server running http://localhost:3000');
})


function assignId(req, res, next){
  req.id = uuid.v4();
  next();
}