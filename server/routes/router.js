const express = require('express');
const route = express.Router();
const passport = require('passport');
require('../middleware/passport-setup');
const services = require('../services/render.js');
const controller = require('../controller/controller.js');
const userDB = require('../model/model.js');
const upload = require('../middleware/multer');


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

route.get('/dashboard',services.homeRoutes);
route.get('/dashboard/actives',services.actives);
route.get('/dashboard/viewmember',services.viewmember);

//Images Routes
route.post('/upload', upload.single('file') ,(req,res) =>{
    console.log(req.file);
    res.sendStatus(200);
});


//API
route.post('/api/members',controller.create);
route.get('/api/members',controller.find);
route.get('/api/active_members',controller.activeMember);

module.exports = route;

route.get('*',(req,res) => {
   
    res.redirect("..");
})