const express = require("express");
require("dotenv").config();
const app = express();


const port = 3000;

app.get("/",(req,res)=>{
    res.send("Hello from server");
});

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
});