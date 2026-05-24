const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    price : {
        type : Number,
        require : true,
    },
    description : {
        type : String,
        require : true,
    },
    category : {
        type : String,
        require : true,
    },
    subCategory : {
        type : String,
    },
    image : {
        type : String,
    }
});


module.exports = mongoose.model('product', productSchema);