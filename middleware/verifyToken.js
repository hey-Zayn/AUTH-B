const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({success : false, message: "Unauthroized - no token provided"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT);
        if(!decoded){
            return res.status(400).json({success:true, message:"Unauthroized - Invalid token"});
        }
        req.userId = decoded.userId;
        next();
    }catch(error){
        console.log("Error in Verify Token",error);
        res.status(500).json({success:false, message: "Server Error"});
    }
}

module.exports = verifyToken;