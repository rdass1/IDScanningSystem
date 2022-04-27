const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session')
const {connectDB} = require('./server/database/connection.js')
require('./server/middleware/passport-setup.js');
const testing = require('./test');
const app = express();


app.set("view engine","ejs");

dotenv.config({path:'config.env'});
const PORT = process.env.PORT||8080;
const URL = process.env.URL + PORT || "http://localhost:"+PORT;



//log request
app.use(morgan('tiny'));

//MongoDB connection
connectDB();



//parse request to body parser
app.use(bodyparser.urlencoded({extended:true}));

//session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));



//set view engine

app.use(express.urlencoded({extended:false}));
//app.use(express.json());

//passport auth
app.use(passport.initialize());
app.use(passport.session());

//loads assets
app.use("/css",express.static(path.resolve(__dirname,"assets/css")));
app.use("/img",express.static(path.resolve(__dirname,"assets/img")));
app.use("/js",express.static(path.resolve(__dirname,"assets/js")));

//load router
app.use('/',require('./server/routes/router'));



app.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`);
});

if(process.env.TEST == "true"){
    testing();
}

