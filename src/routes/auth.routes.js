import { Router } from "express";
import { Register, Login, Logout, dashboard, Refresh } from "../controllers/auth.controller.js";
import authenticateToke from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

//Protected route
router.get("/dashboard", authenticateToke, dashboard);
router.post("/refresh-token", Refresh);


export default router;