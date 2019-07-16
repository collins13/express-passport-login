const express = require('express');

const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require('promise');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const db =  require('./config/keys').mongoURL;
const port = process.env.PORT || 3000;


/*mongoose.connect('mongodb://localhost/register', {useNewUrlParser: true});*/

mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('mongo db connected...'))
.catch(errr =>{
  console.log(err);
});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressLayouts);

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());
app.get((res, req, next) =>{
  res.locals.success = req.flash('success');
  res.locals.error_msg = req.flash('error_msg');
  next()
});

app.set('view engine', 'ejs');
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));













app.listen(port, function(){
  console.log('serve running to port ' + port);
})
