import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectdb from './utils/db.js';

const app = express();

// middlewares
app.use(express.json());
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

// app.use("/api/v1/users", userRoute);

const PORT = process.env.PORT || 5000;

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
