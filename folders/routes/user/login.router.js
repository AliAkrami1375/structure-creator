var express = require('express');
var router = express.Router();
var Users = require("../../model/user/user.model");
var Sessions = require("../../model/user/session.model");
var JWT = require("../../use/jwt")


router.get("/",async (req,res,next)=>{
    const {
        username,
        password
    } = req.body;
    if(typeof username=="undefined" || username==""){
        return res.status(req.headerscode.inputparameter).json({
            code:req.messages.error.enterTrueParameter.code,
            msg:req.messages.error.enterTrueParameter.msg,
            data:{msg:"parameter is username"}
        })
    }
    if(typeof password=="undefined" || password==""){
        return res.status(req.headerscode.inputparameter).json({
            code:req.messages.error.enterTrueParameter.code,
            msg:req.messages.error.enterTrueParameter.msg,
            data:{msg:"parameter is password"}
        })
    }
    const Userfind = await Users.findOne({username:username});
    if(!Userfind){
        return res.status(req.headerscode.error).json({
            code:req.messages.error.usernamenotfound.code,
            msg:req.messages.error.usernamenotfound.msg,
            data:{msg:"please register"}
        })
    }

    Userfind.comparePassword(password,async (error,ismatch)=>{
        if(error || ismatch==false){
            return res.status(req.headerscode.error).json({
                code:req.messages.error.passwordnotmatch.code,
                msg:req.messages.error.passwordnotmatch.msg,
                data:{msg:"password not match"}
            })
        }
        var Token = await JWT.Sign(Userfind._id.toString());
        new Sessions({
            user:Userfind._id,
            token:Token
        }).save();
        return res.status(req.headerscode.success).json({
            code:req.messages.success.LoggedIn.code,
            msg:req.messages.success.LoggedIn.msg,
            data:{token:Token}
        })
    })
    
});

module.exports = router;
