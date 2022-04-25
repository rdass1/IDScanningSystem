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



//Building Routes
route.get('/facilities',services.building);
route.get('/buildings/add_building',services.createBuilding);

//Location Routes
route.get('/locations',services.location);
route.get('/locations/add_location',services.createLocation);

//Classes Routes
route.get('/classes',services.classes);



//Logs Routes
route.get('/logs',services.logs);

//Members Routes
route.get('/members',services.allMembers);
route.get('/members/view',services.viewmember);


//Classes Routes
// route.get('/classes',services.class);
// route.get('/classes/add_class',services.createClass)





//Images Routes
route.post('/upload', upload.single('file') ,(req,res) =>{
    console.log(req.file);
    res.sendStatus(200);
});


//Member API
route.post('/api/members',controller.create);
route.post('/api/members_edit/:id',controller.updateUser);
route.post('/api/members_notes/:id',controller.updateUserNotes);
route.get('/api/members',controller.find);
route.get('/api/active_members',controller.activeMember);
route.post('/api/members_delete/:id',controller.deleteUser);

//Building API
route.get('/api/building',controller.findBuilding);
route.post('/api/create_building',controller.createBuilding);
route.delete('/api/building/:id',controller.deleteBuilding);

//Location API
route.get('/api/locations',controller.findLocation);
route.post('/api/create_location',controller.createLocation);
route.delete('/api/locations/:id',controller.deleteLocation);

//Classes API
route.get('/api/classes',controller.findClasses);
route.post('/api/create_class',controller.createClass);
route.delete('/api/classes/:id',controller.deleteClass);

//UserClasses API
route.post('/api/add_user_class',controller.createUserClass);
route.delete('/api/userClass/:id',controller.deleteUserClass);

//Logs API
route.get('/api/logs',controller.findLogs);
route.delete('/api/logs/:id',controller.deleteLogs);




//Classes API
// route.get('/api/classes',controller.findClass);
// route.post('/api/create_class',controller.createClass);
// route.delete('/api/classes/:id',controller.deleteClass);



module.exports = route;

route.get('*',(req,res) => {
   
    res.redirect("..");
})