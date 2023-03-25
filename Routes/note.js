const express = require("express");
const Note = require("../Schema/note");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/" , (req,res) => {
    res.send("<h1>Welcome To Note API");
});

app.post("/note" , async (req,res) => {
    try{
        const {title , description} = req.body;

        const ttl = await Note.findOne({title});

        if(ttl){
            return res.status(400).json({
                status : "Failed",
                message : "Title Already Exists Choose Another"
            })
        }
        const note = Note.create({
            title,
            description
        })

        return res.status(201).json({
            status : "Success",
            message : "Note Created Successfully",
            note
        })
    }catch(e){
        return res.status(400).json({
            status : "Failed" ,
            message : e.message
        })
    }
});

app.get("/note" , async (req,res) => {
    try{
        const data = await Note.find();
        res.status(201).json({
            status : "Success" ,
            message : "Diplaying All Notes",
            data
        })
    }catch(e){
        return res.status(400).json({
            status : "Failed",
            message : e.message
        })
    }
});

app.delete("/note" , async (req,res) => {
    try{
        await Note.deleteMany();

        return res.status(209).json({
            status : "Success",
            message : "Notes Successfully Deleted"
        })
    }catch(e){
        return res.status(500).json({
            status : "Failed" ,
            message : e.message
        })
    }
})

module.exports = app;