var ServerConfig = require("../../config/server.json")

var Sessions = require("../../model/user/session.model");

var mongoose = require("mongoose")

var JWT = require("../../use/jwt")

async function Auth(req,res,next){
    var token = req.headers[ServerConfig.token_name_header];
    
    if(typeof token=="undefined" || token==""){
        return res.status(req.headerscode.unauth).json({
            code:req.messages.error.enterApiKey.code,
            msg:req.messages.error.enterApiKey.msg,
            data:{msg:"please auth"}
        })
    }

    var userid = await JWT.Verify(token);
    if(userid==false){
        return res.status(req.headerscode.unauth).json({
            code:req.messages.error.enterApiKey.code,
            msg:req.messages.error.enterApiKey.msg,
            data:{msg:"please auth"}
        })
    }

    userid = mongoose.Types.ObjectId(userid);
    var sessionFind = await Sessions.findOne({token:token,user:userid}).populate("user");
    if(!sessionFind || !sessionFind.user){
        return res.status(req.headerscode.unauth).json({
            code:req.messages.error.enterApiKey.code,
            msg:req.messages.error.enterApiKey.msg,
            data:{msg:"please auth"}
        })
    }   
    req.user = sessionFind.user;
    next();
}

module.exports = Auth;