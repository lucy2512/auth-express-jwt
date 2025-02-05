import express from "express";
import  authRoutes  from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
