const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        require : true,
    },
    name : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
    },
    phone : {
        type : String,
        require : true,
    },
    orderItems : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'product',
                require : true,
            },
            price : {
                type : Number,
                require : true,
            },
            quantity : {
                type : Number,
                require : true,
            },
            totalPrice : {
                type : Number,
                require : true,
            }
        }
    ],

    shippingAddress : {
        fullName : {
            type : String,
            require : true,
        },
        phone : {
            type : String,
            require : true,
        },

        address : {
            type : String,
            require : true,
        },
        city : {
            type : String,
            require : true,
        },
        state : {
            type : String,
            require : true,
            default : 'India',
        },
        pinCode : {
            type : String,
            require : true,
        },
        
    },
    total : {
        type : Number,
        require : true,
    },

    createsAt : {
        type : Date,
        default : Date.now,
    },

    paymentMethod : {
        type : String,
        default : 'Cash on Delivery',
    },

});

module.exports = mongoose.model('orders', orderSchema);