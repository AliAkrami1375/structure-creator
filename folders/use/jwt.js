var jwt = require('jsonwebtoken');
var Config = require("../config/auth.json")

function Sign(id){
    return jwt.sign({ id: id.toString() }, Config.secret,{ expiresIn: Config.sessiontime });
}


async function Verify(token){
    try {
        var decoded = await jwt.verify(token, Config.login.secret);
        return decoded.id;
    } catch(err) {
        return false;
    }
}


module.exports = {Sign:Sign,Verify:Verify}