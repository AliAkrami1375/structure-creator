var express = require('express');
var router = express.Router();
var Config = require("../config/server.json");

router.use(`${Config.base_url}`,require("./public/index.router"));

module.exports = router;
