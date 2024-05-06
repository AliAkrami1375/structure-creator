//mongodb Config
const config = require('../db.json');

module.exports = {
    URI: config.mongodb.isauth ?
        `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}?authSource=${config.mongodb.authdb}` : 
        `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`
}