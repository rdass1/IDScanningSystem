const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const models = require('../model/model');

dotenv.config({path:'config.env'});

passport.serializeUser(function(user,done){
  done(null,user);
});

passport.deserializeUser(function(user,done){{
  done(null,user)
}});

// passport.use(new GoogleStrategy({
//     clientID:     process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.URL+process.env.PORT+`/google/callback`,
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     // console.log(profile);

//     //checks database
//     //to be added
//       return done(null, profile);
//   }
// ));

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req,username, password, done) {
    models.employeeLoginDB.find({username: username})
    .then(async user => {
      if(user == null){
        return done(null,false,{message:'No employee with that username'})
      }
      user = user[0];
      //return done(null,{username: user.username,password:user.password, role: user.role,userObjID: user.userObjID})
      try{
        if(await bcrypt.compare(password, user.password)){
          return done(null,{username: user.username,password:user.password, role: user.role,userObjID: user.userObjID})
        }else{
          return done(null,false,{message: 'Incorrect password'})
        }
      }catch(e){
        console.log(e)
        return done(null,false,{message:'error occurred!'})
      }
    })
    .catch(err=>{
      return done(null,false,{message:'error occurred!'})
    });
    
  }
));