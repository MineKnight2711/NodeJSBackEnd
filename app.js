var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/forgotPassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgotPassword.html'));
});

app.get('/resetPassword', (req, res) => {
  const token = req.query.token; // Retrieve the token from the query parameters

  // If token is present and valid, send the reset password page
  if (token) {
    res.sendFile(path.join(__dirname, 'views', 'resetPassword.html'));
  } else {
    // If token is not present or invalid, handle the error (e.g., show a 404 page)
    res.status(404).send('404 Not Found');
  }
});
app.use('/api/v1', require('./routes/index'));
const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/BrosMilkTea")
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

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
