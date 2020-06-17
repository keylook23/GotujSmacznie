var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipeRouter = require('./routes/recipe');

var mongoURL = 'mongodb://localhost/gotuj-smacznie';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("krok123"));

app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'public')));

var CheckCookieUser = function (req, res, next) { 
  if(req.signedCookies){
    req.user = req.signedCookies.user
  } 
  console.log("COOKIE: "+req.user);
  next()
}

app.use('/',CheckCookieUser, indexRouter);
app.use('/users',CheckCookieUser, usersRouter);
app.use('/recipe',CheckCookieUser, recipeRouter);


mongoose.connect(mongoURL, {
  useNewUrlParser: true, //Nowy parser adresów URL
  useUnifiedTopology: true, //Nowy silnik odkrywania i monitorowania
  useCreateIndex: true //Nowy sinik indeksowania klas
}).catch(err => console.log('Unable to connect.', err))

mongoose.connection.on('connected', () => {
  console.log('Connected to database')
});

mongoose.connection.on('error', () => { 
  console.log('Error: not connected to database')
}); 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;