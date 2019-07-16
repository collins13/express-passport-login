const LocalStrategy require('passport-local').Strategy;
const mongoose = require('mongoose');

const bycrypt = require('bycriptjs');

const User = require('./modal/User');

module.exports = function(passport) {
  passport.use(
  new LocalStrategy({userNameField: 'email'}, (email, password, done) =>{
    User.findOne({email:email})
    .then(user =>{
      if (!user) {
        return done(null, false, {message: 'user does not exist please try again'});
      }

      bycrypt.compare(password, user.passport, (error, isMatch)=>{
        if(err) throw err;

        if (isMatch) {
          return done(null, user);
        }else {
          return done(null, false, message:'password incorect');
        }
      })
    })
    .catch(error => console.log(error));

  });
);
};
