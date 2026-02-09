import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./src/config/connectDB.js";
import userRoute from "./src/routes/userRoute.js";

configDotenv();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} -- Request ${req.method}: ${req.url}`);
    next(); // 🔥 VERY IMPORTANT
};

// ✅ MIDDLEWARE FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger)

// ✅ ROUTES BEFORE listen
app.use("/api/user", userRoute);

// ✅ LISTEN AT THE VERY END
app.listen(3001, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
