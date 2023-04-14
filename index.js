const express = require("express");
require("dotenv").config();
require("./models/db");

const userRouter = require("./routes/users");
const locationRouter = require("./routes/locations");
const billRouter = require("./routes/bills");
const statisticRouter = require("./routes/statistics");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useCreateI
// });

// mongoose.connection.on("connected", () => {
//   console.log("Mongoose is connected!!!!!!!!");
// });

app.use(express.json());

app.use(userRouter);
app.use(locationRouter);
app.use(billRouter);
app.use(statisticRouter);

app.get("/test", (req, res) => {
  res.send("Hello world");
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to backend zone!" });
});

//STEP 3
// if(process.env.NODE_)

app.listen(PORT, () => {
  console.log("port is listening");
});
