const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SessionsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:"user"
    },
    token:{
        type: Schema.Types.String,
        default:""
    }
},{ timestamps: true });


const Sessions = module.exports = mongoose.model('user_sessions', SessionsSchema);