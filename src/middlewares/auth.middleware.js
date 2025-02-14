import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const authenticateToke = async (req, res, next) => {
    const prisma = new PrismaClient();
    const authToken = req.header("Authorization");
    const token = authToken.split(" ")[1];

    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!token) return res.status(401).json({ messgae: "Unauthorized" });

    try {
        // console.log("token received: ", token);
        const decoded = jwt.verify(token, "Parthib");
        // console.log("decoed token:", decoded);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true }
        });
        if (!user) return res.status(404).json({ message: "User not found in backend!!!" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authenticateToke;