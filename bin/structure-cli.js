#!/usr/bin/env node
var parseArgs = require('minimist');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var colors = require('colors');
var Argument = process.argv;

var error = colors.red;
var filecreate = colors.blue;
var foldercreate = colors.green;

var MODE_0666 = parseInt('0666', 8);
var MODE_0755 = parseInt('0755', 8);
var VERSION = require('../package.json').version;
var Directory = process.cwd();

var unknown = [];
var args = parseArgs(Argument.slice(2), {
    alias: {
      p: 'path',
      P: 'port',
      h: 'help',
      v: 'version',
      auth:"auth",
      l:"lang",
      socketio:"socketio",
    },
    boolean: ["help","version","socketio","auth"],
    default: { port: 3000 ,path:".",lang:'en'},
    string: ['path','lang'],
    unknown: function (s) {
      if (s.charAt(0) === '-') {
        unknown.push(s)
      }
    }
})

if(unknown.length>0){
    return console.log(error("Error Input Unknown Option check command : structure -h"));
}
console.log(fs.readFileSync(__dirname+'/banner.txt').toString().cyan+"\n\n");
if(args.help){
    return usage()
}
if(args.version){
    return version()
}
function Loading(){
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    const loader = setInterval(() => {
    process.stdout.write(`\rCreating Project With Structure ${P[x++]}`.yellow);
    x %= P.length;
    }, 250);
    setTimeout(() => {
    process.stdout.write('\n');
    clearInterval(loader);
    main(args);
    }, 5000);
}
Loading();

function main(args){
    var dir = args.path
    if (dir == '.') {
        Directory = path.join(Directory)
    }else {
        if(dir.charAt(0)=="/"){
            Directory = dir;
        }else{
            mkdir(Directory, dir)
            Directory = path.join(Directory,dir)
        }
    }
    CreateFolders();   
    EndCreateProjectStructure();
}


function CreateFolders(){
    createInsideBin();
    CreateAppFile();
    createModelsFolder();
    createConfigFolder();
    createViewsFolder();
    createRoutesFolder();
    createSocketfolders();
    createMiddleWareAuth();
    CreatePublicFolder();
    createMessageFolder();
    createUseFolder();
}

function createUseFolder(){
    mkdir(Directory,"use");
    write(path.join(Directory,"use","random.js"),fs.readFileSync(path.join(__dirname,"../folders/use/random.js")))
    if(args.auth){
        write(path.join(Directory,"use","jwt.js"),fs.readFileSync(path.join(__dirname,"../folders/use/jwt.js")))
    }
}

function createMessageFolder(){
    mkdir(Directory,"messages");
    var langs = args.l.split(",");
    if(langs.indexOf("en")<0) langs.push("en");
    langs.forEach(lang => {
        mkdir(Directory,"messages/"+lang);
        write(path.join(Directory,"messages",lang,"success.json"),fs.readFileSync(path.join(__dirname,"../folders/messages/en/success.json")))
        write(path.join(Directory,"messages",lang,"errors.json"),fs.readFileSync(path.join(__dirname,"../folders/messages/en/errors.json")))
    });
}

function CreateAppFile(){
    write(path.join(Directory,"app.js"),fs.readFileSync(path.join(__dirname,"../folders/app.js")))
    write(path.join(Directory,"package.json"),fs.readFileSync(path.join(__dirname,"../folders/package.json")))
}

function CreatePublicFolder(){
    mkdir(Directory,"public");
}

function createSocketfolders(){
    if(args.socketio) mkdir(Directory,"socket");
}

function createViewsFolder(){
    mkdir(Directory,"views");
    write(path.join(Directory,"views","index.ejs"),fs.readFileSync(path.join(__dirname,"../folders/views/index.ejs")))
}

function createInsideBin(){
    mkdir(Directory,"bin");
    if(args.socketio){
        write(path.join(Directory,"bin","www"),fs.readFileSync(path.join(__dirname,"../folders/bin/withsocketio/www")))
        mkdir(Directory,"socket");
        write(path.join(Directory,"socket","index.js"),fs.readFileSync(path.join(__dirname,"../folders/socket/index.js")))
    }else{
        write(path.join(Directory,"bin","www"),fs.readFileSync(path.join(__dirname,"../folders/bin/withoutsocketio/www")))
    }
}

function createModelsFolder(){
    mkdir(Directory,"model");
    write(path.join(Directory,"model","sample.model.js"),fs.readFileSync(path.join(__dirname,"../folders/model/withoutauth/sample.model.js")))
    if(args.auth){
        mkdir(Directory+"/model","user");
        write(path.join(Directory,"model","user","user.model.js"),fs.readFileSync(path.join(__dirname,"../folders/model/withauth/user.model.js")))
        write(path.join(Directory,"model","user","session.model.js"),fs.readFileSync(path.join(__dirname,"../folders/model/withauth/session.model.js")))
    }
}

function createConfigFolder(){
    mkdir(Directory,"config");
    mkdir(path.join(Directory,"config"),"db");
    write(path.join(Directory,"config","headers.json"),fs.readFileSync(path.join(__dirname,"../folders/config/headers.json")))
    if(args.socketio){
        write(path.join(Directory,"config","socket.json"),fs.readFileSync(path.join(__dirname,"../folders/config/socket.json")))
    }
    if(args.auth){
        write(path.join(Directory,"config","auth.json"),fs.readFileSync(path.join(__dirname,"../folders/config/auth.json")))
    }
    var serverconfig = JSON.parse(fs.readFileSync(path.join(__dirname,"../folders/config/server.json")))
    serverconfig.port = args.port;
    var langs = args.l.split(",")
    if(langs.indexOf("en")<0) langs.push("en");
    serverconfig.lang_support = langs;
    write(path.join(Directory,"config","server.json"),JSON.stringify(serverconfig))
    write(path.join(Directory,"config","db.json"),fs.readFileSync(path.join(__dirname,"../folders/config/db.json")))
    write(path.join(Directory,"config","db","config.js"),fs.readFileSync(path.join(__dirname,"../folders/config/db/config.js")))
    write(path.join(Directory,"config","db","connection.js"),fs.readFileSync(path.join(__dirname,"../folders/config/db/connection.js")))
    
}

function createRoutesFolder(){
    mkdir(Directory,"routes");
    if(args.auth){
        write(path.join(Directory,"routes","index.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/index_withauth.js")))
        mkdir(path.join(Directory,"routes"),"user");
        write(path.join(Directory,"routes","user","login.router.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/user/login.router.js")))
        write(path.join(Directory,"routes","user","check.router.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/user/check.router.js")))
        write(path.join(Directory,"routes","user","register.router.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/user/register.router.js")))
    }else{
        write(path.join(Directory,"routes","index.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/index_withoutauth.js")))
    }
    mkdir(path.join(Directory,"routes"),"public");
    write(path.join(Directory,"routes","public","index.router.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/public/index.router.js")))

}

function createMiddleWareAuth(){
    mkdir(path.join(Directory,"routes"),"middleware");
    write(path.join(Directory,"routes","middleware","public.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/middleware/public.js")))
    write(path.join(Directory,"routes","middleware","pagenation.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/middleware/pagenation.js")));
    if(args.auth){
        write(path.join(Directory,"routes","middleware","auth.js"),fs.readFileSync(path.join(__dirname,"../folders/routes/middleware/auth.js")));
    }
}

function EndCreateProjectStructure(){
    console.log("\n");
    console.log("-----------------------".red);
    console.log("project created".green)
    console.log("run project : ".green,"npm i & npm start".gray)
}

function version () {
    console.log(VERSION)
}

function write (file, str, mode) {
    fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
    console.log((filecreate('  write file: ') + file).blue)
}

function mkdir (base, dir) {
    var loc = path.join(base, dir)
    console.log((foldercreate('create folder : ') + loc + path.sep).green)
    mkdirp.sync(loc, MODE_0755)
}

function usage () {
    console.log('')
    console.log('  Usage: structure [options] -p [path]')
    console.log('')
    console.log('  Options:')
    console.log('')
    console.log('    -P, --port              port of project')
    console.log('    -h, --help              output usage information')
    console.log('    -v, --version           version of structure creator')
    console.log('    --auth                  enable auth project')
    console.log('    --socketio              enable socketio server on project')
    console.log('    -l, --lang              language support default en example : en,ar,fa')
  }
