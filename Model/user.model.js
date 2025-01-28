const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: [6, "email character will be more than 6 character "],
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin : {
      type: Date,
      default : Date.now,
    },
    isVerified: {
      type : Boolean,
      default : false, 
    },
    resetPasswordToken : String,
    resetPasswordExpiredAt: Date,
    verificationToken : String,
    verificationTokenExpiresdAt : Date,

  },{timestamps:true});
  
const User = mongoose.model("User", userSchema);
  
module.exports = User;