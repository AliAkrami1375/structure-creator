var RandomeGenerate = require("../use/random")

global.OnlineUsers = {};

var SocketConfig = require("../config/socket.json")


async function Init(server){
    //////Socket Server Config
    global.io = require('socket.io')(server,{path:SocketConfig.base_url});

    //////Listens Socket
    global.io.on('connection', (socket) => {
        socket.uid = RandomeGenerate("string",20);
        global.OnlineUsers[socket.uid] = socket;
        console.log("new user socket connected".green);
        socket.on('disconnect', function () {
            try {
                delete global.OnlineUsers[socket.uid]
            } catch {
            }
            console.log('user disconnected'.red);
        });
    })
}


module.exports=Init;