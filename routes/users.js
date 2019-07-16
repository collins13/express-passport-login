const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../modals/User');

router.get('/', (req, res) => {
  res.send('welcome');
});
router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/register', (req, res) => {
  res.render('register');
});


router.post('/register', (req, res) =>{
  const {name, email, password, password2} = req.body;
  let errors = [];

  //check for errors

  if (!name || !email || !password || !password2) {
    errors.push({msg:'all fields are required'});
  }
  if (password !== password2) {
    errors.push({msg:'password does not match'});
  }
  if (password.length < 6) {
    errors.push({msg: 'password too short'});
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  }else {
    //check email exist
    User.findOne({email:email})
    //check user
    .then(user =>{
      if (user) {
        errors.push({msg: 'email already in use'});
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      }else {
        //create one
        const newUser = new User({
          name,
          email,
          password
        });
        bcrypt.genSalt(10, (err, salt) =>{
          bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if (err) throw err;

            newUser.password = hash;

            newUser.save()
            .then(user =>{
              req.flash('success', 'You are succesfully registred you can now login');
              res.redirect('/users/login');
            })
            .catch(error => console.log(err));
          })
        })
      }
    })
  }
})


module.exports = router;
