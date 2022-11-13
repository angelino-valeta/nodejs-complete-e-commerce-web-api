const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const uuid = require("node-uuid");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler")

const app = express();
require("dotenv/config");

const api = process.env.API_URL;

// Access log
const fileAccessLog = path.join(__dirname, "access.log");
const accessLogStream = fs.createWriteStream(fileAccessLog, { flags: "a" });

// Cors
app.use(cors());
app.options("*", cors());

// Middleware
app.use(bodyParser.json());
morgan.token("id", function getId(req) {
  return req.id;
});
app.use(assignId);
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(
  morgan(
    ':id :remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]',
    { stream: accessLogStream }
  )
);

app.use(authJwt())
app.use('/public/uploads', express.static(__dirname, + '/public/uploads'))
app.use(errorHandler)



// Import Routes
const productRouters = require("./routers/product");
const categoryRouters = require("./routers/category");
const userRouters = require("./routers/user");
const authRouter = require("./routers/auth");

app.use(`${api}/auth`, authRouter);
app.use(`${api}/products`, productRouters);
app.use(`${api}/categories`, categoryRouters);
app.use(`${api}/users`, userRouters);

app.get("/", (req, res) => {
  res.send("Hello API!!");
});

/*
mongoose.connect(process.env.CONNECTION_STRING_LOCAL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop-database'
 }).then(() => {
  console.log('Database connection is ready...')
})
.catch((err) => {
  console.log(err)
})
*/

main()
  .then(() => {
    console.log("Database connection is ready ");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});

function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING_LOCAL);
}
