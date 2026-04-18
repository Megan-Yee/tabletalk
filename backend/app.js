require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");

const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const orgRouter = require("./routes/organization");
const eventRouter = require("./routes/event");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/org", orgRouter);
app.use("/api/v1/events", eventRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
