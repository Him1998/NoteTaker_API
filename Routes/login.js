const express = require("express");
const bcrypt = require("bcrypt");
const { body , validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const noteUser = require("../Schema/noteUser");
const cors = require("cors");
const secret = "Note_Taker" ;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/" , (req,res) => {
    res.send("<h1>Welcome to Login and Register API");
});

app.post("/register" , body("email").isEmail() ,async (req,res) => {

    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message : "Invalid Email Value"
            })
        }

        const { email , password , conf_password } = req.body ;

        if(password != conf_password) {
            return res.status(409).json({
                status : "Failed" ,
                message : "Passwords did not match"
            });
        }

        const user = await noteUser.findOne({email});

        if(user) {
            return res.status(409).json({
                status : "Failed" ,
                message : "User Already Exists"
            });
        }

        bcrypt.hash(password , 10 , async function (err , hash){
            if(err){
                return res.status(500).json({
                    status : "Error" ,
                    message : err.message
                });
            }
            const data = await noteUser.create({
                email ,
                password : hash
            });

            return res.status(200).json({
                status : "Success" ,
                message : "User Successfully Registered",
                data
            });
        })

    }catch(e) {
        return res.status(500).json({
            status : "Error" ,
            message : e.message
        })
    }
});

app.post("/login" , body("email").isEmail() ,async (req,res) => {

    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                message : "Invalid Email Value"
            })
        }

        const {email , password} = req.body;

        const user = await noteUser.findOne({email});

        if(!user) {
            return res.status(409).json({
                status : "Failed" ,
                message : "User is not Registered"
            });
        }

        bcrypt.compare(password , user.password , async function (err , result){
            if(err){
                return res.status(500).json({
                    status : "Error" ,
                    message : err.message
                });
            }
            if(result) {
                const token = jwt.sign({
                    exp : Math.floor(Date.now() / 1000) + 60 * 60 ,
                    data : user._id,
                },
                secret
                );

                return res.status(200).json({
                    status : "Success" ,
                    message : "Login Successful",
                    token
                })
            }else{
                return res.status(400).json({
                    status : "Failed" ,
                    message : "Wrong Password"
                })
            }
        })

    }catch(e) {
        return res.status(500).json({
            status : "Error" ,
            message : e.message
        })
    }
});


module.exports = app;