var express = require('express');
var router = express.Router();
var Config = require("../config/server.json");
var Middleware = require("./middleware/auth")

router.use(`${Config.base_url}`,require("./public/index.router"));

router.use(`${Config.base_url}login`,require("./user/login.router"));

///////WithMiddle Ware Check Token
router.use(`${Config.base_url}check`,Middleware,require("./user/check.router"));

module.exports = router;
