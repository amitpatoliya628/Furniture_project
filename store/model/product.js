const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName : {
        type : String,
        require : true,
    },
    productPrice : {
        type : Number,
        require : true,
    },
    productDescription : {
        type : String,
        require : true,
    },
    productCategory : {
        type : String,
        require : true,
    },
    productSubCategory : {
        type : String,
    },
    productImage : {
        type : String,
    }
});


module.exports = mongoose.model('product', productSchema);