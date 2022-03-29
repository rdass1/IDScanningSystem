const express = require('express');
const route = express.Router();
const passport = require('passport');
require('../middleware/passport-setup');
const services = require('../services/render.js');
const controller = require('../controller/controller.js');
const {userDB} = require('../model/model.js');
const upload = require('../middleware/multer');
const { runInContext } = require('lodash');


/**
 * @description Root Route
 * @method GET /
 */
 
route.get('/',services.index);



route.get('/login',controller.login);

//Needs to be moved

const isLoggedIn = (req,res,next) =>{
    if(req.user){
        next();
    }else{
        res.status(401).send("Please log in first");
    }
}





//

route.get("/sse", (req,res) =>{
    res.set("Content-Type", "text/event-stream");
    res.set("Connection", "keep-alive");
    res.set("Cache-Control","no-cache");
    res.set("Access-Control-Allow-Origin", "*");
    console.log('client connected.');
    
    userDB.watch().
        on('change', data => {
        res.status(200).write(`data: update\n\n`);
        });

    
});


route.get('/good', isLoggedIn, (req,res) =>{
    res.send(`Welcome ${req.user.displayName}!`);
});

route.get('/failed', (req,res) =>{
    res.send("failed login");
});

route.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

route.post('/login', 
  passport.authenticate('local', { 
      failureRedirect: '/',
      successRedirect: '/dashboard' 
    }));
// route.post('/login', (req,res) => {
//     res.send(req.body);
// });

route.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/dashboard',
        failureRedirect: '/failed'
}));

route.get('/logout', (req,res)=>{
    req.logout();
    res.send('Logged OUt');
});

//Dashboard Routes

route.get('/dashboard',services.homeRoutes);
route.get('/dashboard/viewmember',services.viewmember);


//Building Routes
route.get('/buildings',services.building);
route.get('/buildings/add_building',services.createBuilding);

//Location Routes
route.get('/locations',services.location);
route.get('/locations/add_location',services.createLocation);




//Images Routes
route.post('/upload', upload.single('file') ,(req,res) =>{
    console.log(req.file);
    res.sendStatus(200);
});


//Member API
route.post('/api/members',controller.create);
route.get('/api/members',controller.find);
route.get('/api/active_members',controller.activeMember);

//Building API
route.get('/api/building',controller.findBuilding);
route.post('/api/create_building',controller.createBuilding);
route.delete('/api/building/:id',controller.deleteBuilding);

//Location API
route.get('/api/locations',controller.findLocation);
route.post('/api/create_location',controller.createLocation);
route.delete('/api/locations/:id',controller.deleteLocation);



module.exports = route;

route.get('*',(req,res) => {
   
    res.redirect("..");
})