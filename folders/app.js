var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var session = require('express-session')
var devices = require('express-device');
var ServerConfig = require("./config/server.json");
require('./config/db/connection');

//////Config Base Project
var app = express();
if(ServerConfig.product==false) app.use(logger('dev'));
console.log("Started Project");

///Ejs Config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//////////JSON Parse API
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

/////Cookie Parser
app.use(cookieParser());

//Public Folder
app.use(express.static(path.join(__dirname, 'public')));

////Trust Proxy
app.set('trust proxy', 1)

////////////Config Session
app.use(session({
  secret: 'aiosud2376yhalksd872836rhasdkjh',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}))


//////Uploader File Config
app.use(fileUpload());


//Cors Handle
app.use('*', cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
app.all(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods");
  res.header("Access-Control-Allow-Methods', 'GET,POST");
  next();
});

////////////Device Capture
app.use(devices.capture());


///MiddleWare
app.use(require("./routes/middleware/public"))
app.use(require("./routes/middleware/pagenation"))

////////////Router Use
var AllRoute = require("./routes")
app.use("/", AllRoute)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    code: -404,
    data: {},
    msg: "Route Not Found"
  })
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    code: (err.status || 500) * (-1),
    msg: err.message,
    data: {}
  })
});

module.exports = app;