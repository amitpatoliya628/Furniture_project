const mongoose =require('mongoose');

const userSchema =mongoose.Schema({
    fullName : {
        type : String,
        required : [true, 'Enter Your Full Name'],
    },
    email : { 
        type :String,
        required : [true, 'Email is Required'],
        unique : true,
    },
    mobile : {
        type :String,
        required : [true, 'Mobile Number is Required'],
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        required : [true, 'Enter Your Gender First'],
    },
    password : {
        type :String,
        required : [true, 'Password must be Filled'],
    },

});

module.exports = mongoose.model('user', userSchema);