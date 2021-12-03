const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: [ "http://localhost:3000",
  "http://localhost:3002",
  "http://13.209.142.194:3000",
]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   //initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to api server" });
});

// routes
// require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);

require('./app/routes/account.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/suyongga.routes')(app);
require('./app/routes/wmeter.routes')(app);
require('./app/routes/wmeterdata.routes')(app);

require('./app/routes/batchwork.routes')(app);

require('./app/routes/test.routes')(app);

require('./app/routes/wmdtotal.routes')(app);
require('./app/routes/farm.routes')(app); // AD 수산 추가
require('./app/routes/feed.routes')(app); // AD 수산 추가
require('./app/routes/feedAction.routes')(app); // AD 수산 추가
require('./app/routes/wtank.routes')(app); // AD 수산 추가
require('./app/routes/breedinfo.routes')(app); // AD 수산 추가
require('./app/routes/parameter.routes')(app); // AD 수산 추가

require('./app/routes/salt.routes')(app); // 

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

