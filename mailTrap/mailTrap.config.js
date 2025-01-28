const { MailtrapClient } = require("mailtrap");

const TOKEN = "bfd6c00c32e5b229c6baa1961dc3b295";

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Ideo LMS",
};


// const recipients = [
//   {
//     email: "zaynobusiness@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);


module.exports = { mailtrapClient, sender}