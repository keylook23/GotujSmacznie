var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addrecipeRouter = require('./routes/addrecipe');
var readrecipeRouter = require('./routes/readrecipe');

var app = express();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');




var dbConn = mongodb.MongoClient.connect('mongodb+srv://keylook:maSBpzURP4GLdKFN@cluster0-swqvi.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true } );

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'views')));

app.post('/addrecipe', function (req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/addrecipe',addrecipeRouter);
app.use('/readrecipe',readrecipeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


