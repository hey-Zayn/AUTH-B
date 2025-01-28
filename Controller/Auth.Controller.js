const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../Model/user.model");
const genrateTokenAndSetCookies = require("../utils/genrateTokenAndSetCookies");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailTrap/emails");


const Signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({ message: "All Feilds Required" });
    }
    const ifUserAlreadyExist = await User.findOne({ email });
    if (ifUserAlreadyExist) {
      return res.status(400).json({ message: "User Already Exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000 // <-- Add parentheses here
    ).toString();

    const register = await User.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: hashPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresdAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await register.save();
    // jwt
    genrateTokenAndSetCookies(res, register._id);
    try {
      await sendVerificationEmail(register.email, verificationToken);
      console.log("Verification email sent successfully!");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }

    res.status(200).json({
      success: true,
      message: "User Created Successfully",
      register: {
        ...register._doc,
        password: undefined, // Don't send the password back
      },
    });
  } catch (error) {
    res.send("Server Error At Controllers");
    console.log(error);
  }
};


const verifyEmail = async (req, res) => {
  //  - - - - - -
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresdAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invaild or Expire Token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresdAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.userName);
    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Email Verification Error || Server Error",
      // Optionally, you can send back some user data
      // user: { ...user._doc, password: undefined }
    });
  }
};


const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordVaild = await bcrypt.compare(password, user.password);
    if (!isPasswordVaild) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    genrateTokenAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login Error || Server Error" });
  }
};


const Logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};


const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: true, message: "User not found!" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiredAt = resetTokenExpiresAt;

    await user.save();

    // Send Email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link send to you email",
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error in forget Password",error });
  }
};

const resetPassword = async(req,res) => {
  try{
    const {token} = req.params;
    const {password} = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiredAt: { $gt: Date.now() },
    });
    if(!user){
    return  res.status(400).json({success:true, message:"Invalid or Expired reset token"})
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiredAt = undefined;

    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({message: "Password reset successfully"});
  }catch(error){
    res.status(400).json({message: "Error in password reset",error});

  }
};

const checkAuth = async(req,res)=>{
  try{
    const  user = await User.findById(req.userId).select("-password");
    if(!user){
      return res.status(400).json({message : "User not found"});
    }

    res.status(200).json({success: true, user});

  }catch(error){
    console.log("Error in checkAuth",error);
    res.status(500).json({message: "Error in checkAuth"});
  }
};

module.exports = { Signup, verifyEmail, Login, Logout, forgetPassword, resetPassword, checkAuth };
