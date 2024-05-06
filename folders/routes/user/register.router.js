var express = require('express');
var router = express.Router();
var Users = require("../../model/user/user.model");
var JWT = require("../../use/jwt")


router.get("/", async (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (typeof username == "undefined" || username == "") {
        return res.status(req.headerscode.inputparameter).json({
            code: req.messages.error.enterTrueParameter.code,
            msg: req.messages.error.enterTrueParameter.msg,
            data: {
                msg: "parameter is username"
            }
        })
    }
    if (typeof password == "undefined" || password == "") {
        return res.status(req.headerscode.inputparameter).json({
            code: req.messages.error.enterTrueParameter.code,
            msg: req.messages.error.enterTrueParameter.msg,
            data: {
                msg: "parameter is password"
            }
        })
    }
    const Userfind = await Users.findOne({
        username: username
    });
    if (Userfind) {
        return res.status(req.headerscode.error).json({
            code: req.messages.error.usernameIsExist.code,
            msg: req.messages.error.usernameIsExist.msg,
            data: {
                msg: "please login"
            }
        })
    }


    const UserCreated = await new Users({
        username,
        password
    }).save()

    if (!UserCreated) {
        return res.status(req.headerscode.error).json({
            code: req.messages.error.errorCreateUser.code,
            msg: req.messages.error.errorCreateUser.msg,
            data: {
                msg: "please contact support"
            }
        })
    }
    var Token = await JWT.Sign(UserCreated._id.toString());
    new Sessions({
        user: UserCreated._id,
        token: Token
    }).save();
    return res.status(req.headerscode.success).json({
        code: req.messages.success.LoggedIn.code,
        msg: req.messages.success.LoggedIn.msg,
        data: {
            token: Token
        }
    })
});

module.exports = router;