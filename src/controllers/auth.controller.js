import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Register = async (req,res) => {
    try {
        const {email, password} = req.body;

        //check if user already exists
        const existingUser = await prisma.user.findUnique({ where : {email}});
        if(existingUser) return res.status(400).json({ message : "User already exists"});

        await prisma.user.create({
            data: {email, password}
        });
        res.status(201).json({message : "User registered successfully"});
    } catch (error){
        res.status(500).json({message: error.message});
    }
};