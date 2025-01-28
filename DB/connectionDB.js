const mongoose = require("mongoose");

const connectionDB = async () => {
 await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`DB Connected Successfully`);
    })
    .catch(() => {
      console.log(`DB Error`);
    });
};

module.exports = connectionDB;
