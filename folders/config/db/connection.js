///////DBConnect
const DBConfig = require('./config.js');
const mongoose = require('mongoose');
mongoose
  .connect(DBConfig.URI)
  .then(() => {
    console.log("Database connected!".green)
  })
  .catch(err => console.log("MongoDB Error For Connected : ".red,err.toString().red));
