const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const genrateTokenAndSetCookies = require("../utils/genrateTokenAndSetCookies");
const sendVerificationEmail = require("../mailTrap/emails")

const Signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({message : "All Feilds Required"});
    }
    const ifUserAlreadyExist = await User.findOne({ email });
    if (ifUserAlreadyExist) {
      return res.status(400).json({ message: "User Already Exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    
    const verificationToken = Math.floor(
      100000 + (Math.random() * 900000) // <-- Add parentheses here
    ).toString();

    const register = await User.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: hashPassword,
      verificationToken : verificationToken,
      verificationTokenExpiresdAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await register.save();
    // jwt
    genrateTokenAndSetCookies(res, register._id);
    try {
      await sendVerificationEmail(register.email, verificationToken);
      console.log('Verification email sent successfully!'); 
    } catch (error) {
      console.error('Error sending verification email:', error);
    }

    res.status(200).json({
      success: true, 
      message : "User Created Successfully",
      register: {
        ...register._doc,
        password: undefined // Don't send the password back
      }
    });
  }catch (error) {
    res.send("Server Error At Controllers");
    console.log(error);
  }
};

module.exports = { Signup };
