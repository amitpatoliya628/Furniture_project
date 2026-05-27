const mongoose =require('mongoose');

const contactMessageSchema = mongoose.Schema({
    fname : {
        type : String,
        require : true,
    },
    lname : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
    },
    message : {
        type : String,
        require : true,
    },
});

module.exports = mongoose.model('contactMessage', contactMessageSchema);