const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    type: {
        type: String,
        // required: true, 
    },
    username: {
        type: String,
        required: true, 
    },
    email: {
        type: String,   
        required: true,        
    },
    password: {
        type: String,
        required: true, 
        // minlength: 6
    },
    notes: {
        type: Array,
        default: null        
    }
})

module.exports =  mongoose.model("User", userSchema);