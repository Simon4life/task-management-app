require('dotenv').config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const boardRouter = require("./routes/boardsRoute");
const tasksRouter = require("./routes/taskRoute");
const connectDB = require("./db/connect");
const errorHandlerMiddleWare = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const authentication = require("./middleware/authentication");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cookieParser(process.env.SECRET));


app.use("/api/v1/boards", authentication, boardRouter);
app.use("/api/v1/tasks", authentication, tasksRouter);
app.use("/auth", authRouter);

app.use(errorHandlerMiddleWare);

const port =  process.env.PORT || 8000;

const start = async () => {
try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening at port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
