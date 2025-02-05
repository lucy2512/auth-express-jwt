import express from "express";
import  authRoutes  from "./src/routes/auth.routes.js";


const app = express();

app.use(express.json());

//Routes

app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
