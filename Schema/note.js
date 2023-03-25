const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    title : {type : String , required : true} ,
    description : {type : String , required : true}
} , {timestamps : true}
);

const noteModel = mongoose.model("Note" , noteSchema);

module.exports = noteModel ;

