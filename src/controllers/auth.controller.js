import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateToken = (user) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_ACCESS_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

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
        // const token = jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: "5m" });
        // console.log(token);
        // res.cookie("token", token, { httpOnly: true });

        //Storing the token in response header
        //res.status(200).header("Authorization", `Bearer ${token}`).json({ token, messgae: "Login Successful!!" });


        //Generate both the tokens
        const tokens = generateToken(user);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken }
        });
        // console.log(tokens);
        res.json(tokens);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const Logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true
    });
    res.json({ message: "Logout successful!!!" });
}

export const dashboard = (req, res) => {
    res.json({ message: "(backend)Authenticatd", user: req.user });
}


//Refresh Token Controller
export const Refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized!!(Refreshtoken not found)" });

    // const user = await prisma.user.findFirst({ where: { refreshToken } });
    // if (!user) return res.status(403).json({ error: "Invalid Refresh Token 1" });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)

    if (!decoded?.id) return res.status(403).json({ error: "Invalid Refresh Token" })

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true }
    });

    const tokens = generateToken(user);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    // jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    //     if (err) return res.status(403).json({ error: "Invalid Refresh Token" });


    //     const tokens = generateToken(user);
    //     prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
    //     console.log("new tokens:", tokens);
    //     res.json(tokens);
    // });

    res.json(tokens);
}