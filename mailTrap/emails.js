const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates");
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

// const sendWelcomeEmail = async (email, userName) => {
//   const recipient = [{ email }];
//   try {
//     await mailtrapClient.send({
//       from: sender,
//       to: recipient,
//       template_uuid: "b9d51625-238d-41a3-a3f5-83f055a08abf",
//       template_variables: {
//         name: userName,
//         company_info_name: "IDEOVERSTY",
//       },
//     });
//     console.log(`Welcome Email Send successfully`, response);
//   } catch (error) {
//     console.log(`Send Welcome Email Error`);
//   }
// };

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
    //   res.status(200).json({
    //     success: true,
    //     message : "Email Verified Successfully",
    //     user : {
    //         ...user._doc,
    //         password: undefined,
    //     }
    //   });
    console.log("Welcome Email Send successfully", response);
    } catch (error) {
      console.error("Send Welcome Email Error:", error); 
      // Consider logging error.message or error.code for more details
      // You might also want to throw the error for higher-level handling
      // throw error;
    }
  };
  

module.exports = { sendVerificationEmail, sendWelcomeEmail };
