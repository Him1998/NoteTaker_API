const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Note = require("./Schema/note");
const noteUser = require("./Schema/noteUser");
const cors = require("cors");
const url = "mongodb+srv://Social_app:socialtestapp@cluster0.ykau5il.mongodb.net/?retryWrites=true&w=majority";
const Port = 8080 || process.env.PORT ;
const jwt = require("jsonwebtoken");
const secret = "Note_Taker" ;
const userRoute = require("./Routes/login");
const noteRoute = require("./Routes/note");


const app = express();
app.use(bodyParser.json());
app.use(cors());

async function conn () {
    await mongoose.connect(url);
    console.log("connected to mongoose");
}

conn();

app.get("/" , (req,res) => {
    res.send("<h1>Welcome to Note Taker API")
});

app.use("/v1", (req,res,next) => {

    try{
        const token = req.headers.authorization;

        if(token){
            jwt.verify(token,secret, async (err , decoded) => {
                if(err){
                    console.log(err);
    
                    return res.status(409).json({
                        status : "Failed",
                        message : "Invalid Token"
                    });
                }
                const loggedinuser = await noteUser.find({_id: decoded.data});
                req.user = loggedinuser[0];
                next();
            });
        }else {
            console.log("User Not Authenticated");
            res.status(403).json({
                status : "Failed" ,
                message : "User Not Authenticated"
            });
        }
    }catch(e){
        return res.json({
            message : e.message
        })
    }
});

app.use("/user" , userRoute);
app.use("/v1", noteRoute);

app.listen(Port , () => {
    console.log(`server is up at ${Port} `);
})