const express = require('express')
const app = express();
const port = 3000;
const path = require("path");
require('./database/db')
const cors = require('cors');
const firebase= require('./firebase/firebase');

app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "storeImage"));
app.set("view engine", "ejs");

// const morgan = require('morgan');
// app.use(morgan('dev'));


const userRoute = require('./routes/usersRoute');
app.use('/', userRoute);

const buildingRoute = require('./routes/buildsRoute');
app.use('/', buildingRoute);

const unitsRoute = require('./routes/unitsRoute');
app.use('/', unitsRoute);

const ownersRoute = require('./routes/ownersRoute');
app.use('/', ownersRoute);

const tenantsRoute = require('./routes/tenantsRoute');
app.use('/', tenantsRoute);

const contractsRoute = require('./routes/contractsRoute');
app.use('/', contractsRoute);

const paymentRoute=require('./routes/paymentsRoute');
app.use('/', paymentRoute);


app.listen(port, () => {
   console.log(`App is listening on port :${port}`)
});


