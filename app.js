const express = require("express");
require("dotenv").config();
const app = express();
const connectionDB = require("./DB/connectionDB");
const router = require("./Routes/auth.router");
const cors = require("cors");
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/',router);

connectionDB();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
