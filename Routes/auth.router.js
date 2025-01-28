const express = require("express");
const router = express.Router();
const {Signup, verifyEmail} = require("../Controller/Auth.Controller");

router.post("/signup",Signup);

router.get('/login',(req,res)=>{
    res.send("Login Router");
});

router.get('/logout',(req,res)=>{
    res.send("Logout Router");
});

router.post('/verify-email', verifyEmail);


module.exports = router;