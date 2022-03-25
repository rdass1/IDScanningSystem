const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');

const connectDB = require('./server/database/connection.js')

const app = express();

dotenv.config({path:'config.env'})
const PORT = process.env.PORT||8080

//log request
app.use(morgan('tiny'));

//MongoDB connection
connectDB();

//parse request to body parser
app.use(bodyparser.urlencoded({extended:true}));

//set view engine
app.set("view engine","ejs");

//loads assets
app.use("/css",express.static(path.resolve(__dirname,"assets/css")));
app.use("/img",express.static(path.resolve(__dirname,"assets/img")));
app.use("/js",express.static(path.resolve(__dirname,"assets/js")));

//load router
app.use('/',require('./server/routes/router'));



app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`);
});

