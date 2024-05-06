var express = require('express');
var router = express.Router();

router.get("/",async (req,res,next)=>{
    return res.send("access grant")
});

module.exports = router;
