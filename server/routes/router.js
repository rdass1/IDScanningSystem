const express = require('express');
const route = express.Router();
const passport = require('passport');
const services = require('../services/render.js');
const controller = require('../controller/controller.js');


/**
 * @description Root Route
 * @method GET /
 */
route.get('/',controller.login);

//Needs to be moved

const isLoggedIn = (req,res,next) =>{
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
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

