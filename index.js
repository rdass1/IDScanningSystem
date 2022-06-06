const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session')
const {connectDB} = require('./server/database/connection.js')
require('./server/middleware/passport-setup.js');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const fs = require('fs');
const http = require('http');
const cors = require('cors');

const scriptSources = ["'self'","'unsafe-inline'", "'unsafe-eval'","https://maps.googleapis.com", "https://www.google.com", "https://www.gstatic.com","https://ajax.googleapis.com","https://printjs-4de6.kxcdn.com/"];
const styleSources = ["'self'", "'unsafe-inline'","https://ajax.googleapis.com","https://printjs-4de6.kxcdn.com/"];
const connectSources = ["'self'","https://ajax.googleapis.com"];
const frameSources = ["'self'","https://ajax.googleapis.com"]
const imgSources = ["'self'", "data:","https://tuk-cdn.s3.amazonaws.com"]


/**
 * @description Used for webapp security, requires HTTPS to be setup;
 *
 */

// app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: scriptSources,
//         scriptSrcElem: scriptSources,
//         styleSrc: styleSources,
//         styleSrcElem: styleSources,
//         connectSrc: connectSources,
//         reportUri: '/report-violation',
//         frameSrc: frameSources,
//         imgSrc: imgSources,
//         scriptSrcAttr: "'unsafe-inline'",
//       },
//     },
//     crossOriginResourcePolicy:{ policy: "cross-origin" },
//     crossOriginEmbedderPolicy: false,
//   }));
app.use(compression());
app.use(cors());

app.set("view engine","ejs");

dotenv.config({path:'config.env'});
const PORT = process.env.PORT||8080;
const URL = process.env.URL + PORT || "http://localhost:"+PORT;



//log request
// app.use(morgan('tiny'));

//MongoDB connection
connectDB();



if(!fs.existsSync("./server/memberIDImages")){
    fs.mkdirSync("./server/memberIDImages")
    console.log("Images folder being created...")
}
if(!fs.existsSync("./server/memberImages")){
    fs.mkdirSync("./server/memberImages")
}




//parse request to body parser
app.use(bodyparser.urlencoded({extended:true}));

//session
app.use(session({
    secret: process.env.SECRET,
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
app.use("/memberIDImages",express.static(path.resolve(__dirname,"server/memberIDImages")));


//load router
app.use('/',require('./server/routes/router'));

var httpServer = http.createServer(app);


httpServer.listen(PORT,()=>{
    console.log(`server is running on localhost:${PORT}`);
});
