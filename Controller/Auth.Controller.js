const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const genrateTokenAndSetCookies = require("../utils/genrateTokenAndSetCookies");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
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
      // Optionally, you can send back some user data
      // user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(500).json({
      message: "Email Verification Error || Server Error",
      // Optionally, you can send back some user data
      // user: { ...user._doc, password: undefined }
    });
  }
};

module.exports = { Signup, verifyEmail };
