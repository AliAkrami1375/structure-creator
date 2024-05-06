const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SampleSchema = mongoose.Schema({
    name: {
        type: Schema.Types.String,
        default:""
    },
    family: {
        type: Schema.Types.String,
        default:""
    }

},{ timestamps: true });


const SampleMpdel = module.exports = mongoose.model('sample', SampleSchema);
