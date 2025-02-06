import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export const Register = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        await prisma.user.create({
            data: { email, password }
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const Login = async (req, res) => {
    try {
        // console.log("entred");

        const { email, password } = req.body;
        // console.log(password);
        // console.log(prisma.user.password);
        //check for email 
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //Generate Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "5m" });
        // console.log(token);

        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ messgae: "Login Successful!!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const Logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful!!!" });
}

export const dashboard = (req, res) => {
    res.json({ message: "(backend)Authenticatd", user: req.user });
}