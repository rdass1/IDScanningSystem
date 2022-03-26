const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

passport.serializeUser(function(user,done){
  done(null,user);
});

passport.deserializeUser(function(user,done){{
  done(null,user)
}});

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.URL+process.env.PORT+`/google/callback`,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // console.log(profile);

    //checks database
    //to be added
      return done(null, profile);
  }
));

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req,username, password, done) {
    
    console.log(username);
    console.log(password);
    console.log(req.body.role);
    return done(null, {
      username:username,
      password:password,
    });
  }
));