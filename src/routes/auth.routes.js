import {Router} from "express";
import { Register, Login, Logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);


export default router;