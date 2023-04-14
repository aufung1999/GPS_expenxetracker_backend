const express = require("express");
require("dotenv").config();
require("./models/db");

const userRouter = require("./routes/users");
const locationRouter = require("./routes/locations");
const billRouter = require("./routes/bills");
const statisticRouter = require("./routes/statistics");

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(locationRouter);
app.use(billRouter);
app.use(statisticRouter);

// app.get("/test", (req, res) => {
//   res.send("Hello world");
// });

// app.get("/", (req, res) => {
//   res.json({ success: true, message: "Welcome to backend zone!" });
// });

app.listen(5000, () => {
  console.log("port is listening");
});
