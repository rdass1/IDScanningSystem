const express = require('express');
const route = express.Router();
const passport = require('passport');
require('../services/passport-setup');
const services = require('../services/render.js');
const controller = require('../controller/controller.js');


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

route.get('/dashboard',isLoggedIn,services.homeRoutes);
route.post('/dashboard',function(req, res, next) {
    res.redirect('/dashboard?active=true');
    console.log('post');
});

//API
route.post('/api/members',controller.create);
route.get('/api/members',controller.find);
route.get('/api/active_members',controller.activeMember);

module.exports = route;

