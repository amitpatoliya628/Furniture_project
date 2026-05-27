const mongoose = require('mongoose');

const newsLatterSchema = mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
    }
})

module.exports = mongoose.model('newsLatter', newsLatterSchema);