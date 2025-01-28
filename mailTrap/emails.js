const {VERIFICATION_EMAIL_TEMPLATE} = require("./emailTemplates")
const {mailtrapClient, sender} = require("./mailTrap.config");
const sendVerificationEmail = async (email , verificationToken)=>{
    const recipient = [{email}];
    try{
        const response = await mailtrapClient.send({
                from: sender,
                to: recipient,
                subject: "Verify Your Email",
                html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "Email Verification",
              });
        console.log(`Email Send successfully`, response)
    }catch(error){
        console.log(`Verification Email Sending Error`);
    }
}

module.exports = sendVerificationEmail;