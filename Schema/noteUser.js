const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email : { type : String , required : true} ,
    password : { type : String },
    conf_password : {type : String }
})

const userModel = mongoose.model("noteUser" , userSchema);

module.exports = userModel ;