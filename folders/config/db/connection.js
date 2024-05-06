///////DBConnect
const DBConfig = require('./config.js');
const mongoose = require('mongoose');
mongoose
  .connect(DBConfig.URI)
  .then(() => {
    console.log("Database connected!")
  })
  .catch(err => console.log("MongoDB Error For Connected",err));
