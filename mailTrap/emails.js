const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE
} = require("./emailTemplates");
const { mailtrapClient, sender } = require("./mailTrap.config");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log(`Email Send successfully`, response);
  } catch (error) {
    console.log(`Verification Email Sending Error`);
  }
};

const sendWelcomeEmail = async (email, userName) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "b9d51625-238d-41a3-a3f5-83f055a08abf",
      template_variables: {
        name: userName,
        company_info_name: "IDEOVERSTY",
      },
    });
    console.log("Welcome Email Send successfully", response);
    console.log("Welcome Email Send successfully", response);
  } catch (error) {
    console.error("Send Welcome Email Error:", error);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Reset Password",
    });
  } catch (error) {
    res.status(400).json({ message: "Reset Password Email Error" });
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try{
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset",
      });
      console.log(` Password Reset Successfull`);
  }catch(error){
    console.log(`Error in reset Password ${error}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
