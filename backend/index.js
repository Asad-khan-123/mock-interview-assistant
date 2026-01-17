import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectdb from './utils/db.js';
import router from './routers/user.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));
// app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running",
    success: true
  })
})

app.use("/api/v1/users", router);

const PORT = process.env.PORT;

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log('mongodb connected succesfully')
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });


// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./utils/db.js";
// import dotenv from "dotenv";
// import userRoute from "./routes/user.routes.js";
// dotenv.config();

// const app = express();

// // middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true}));
// app.use(cookieParser());
// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true
// }
// app.use(cors(corsOptions));

// app.get("/", (req, res) => {
//   return res.status(200).json({
//     message: "Server is running",
//     success: true
//   })
// })

// app.use("/api/v1/users", userRoute);

// const PORT = 8000;

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`server is running on PORT ${PORT}`)
// })
