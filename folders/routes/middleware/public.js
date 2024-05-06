const requestIp = require('request-ip');
const useragent = require('express-useragent');
const ServerConfig = require("../../config/server.json");
const fs = require("fs");
const path = require("path");
var Messages = {};
const HeaderCodes = require("../../config/headers.json")

/////////Messages
async function ReadAllMessages(){
    var langs = await fs.readdirSync(path.join(__dirname,"../../messages"));
    await langs.forEach(lang => {
        Messages[lang] = {
            success : require("../../messages/"+lang+"/success.json"),
            error : require("../../messages/"+lang+"/errors.json")
        }
    });
}
ReadAllMessages();
////////
async function All(req,res,next){
    res.setHeader('X-Powered-By', 'Structure Creator | aliakrami13751@gmail.com');
    ///////////////User Agent Parser
    var source = req.headers['user-agent'];
    try {
        req.ua = useragent.parse(source);
    } catch {
        req.ua = {device:"desktop",isMobile:false,isTablet:false,isMobileNative:false,isiPad:false,browser:"firefox",os:'windows'};
    }
    req.ip = requestIp.getClientIp(req);

    //////Language Support
    if (!req.headers.lang) {
        req.lang = "en";
    } else {
        req.lang = req.headers.lang;
    }
    if(ServerConfig.lang_support.indexOf(req.lang)<0) req.lang = ServerConfig.lang_support[0]

    /////Device
    req.device = "";
    if (req.ua.isDesktop) req.device = "desktop";
    else if (req.ua.isMobile || req.ua.isMobileNative) req.device = "mobile";
    else if (req.ua.isTablet || req.ua.isiPad) req.device = "tablet";
    else req.device = "other";

    //Messages
    req.messages = Messages[req.lang];

    //Headers Code 
    req.headerscode = HeaderCodes;
    
    next();
}

module.exports = All;