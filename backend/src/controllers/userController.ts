import { Request, Response } from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import getErrorMessage from "../utils.js";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import Chat from "../models/chat.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id: Types.ObjectId): string => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export async function registerUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            error: 'missing parameter'
        })
    }

    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({
                success: false,
                error: 'User already exists with this email'
            })
        }
        const user = await User.create({ name, email, password })

        const token = generateToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        res.json({
            success: true,
            message: 'user registrered successfull'
        })
    } catch (error) {
        return res.json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            error: 'missing parameter'
        })
    }
    try {
        const user = await User.findOne({ email })

        if (user) {
            const checkPassword = await bcrypt.compare(password, user.password)

            if (checkPassword) {
                const token = generateToken(user._id)
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
                return res.json({
                    success: true,
                    message: 'Logged in successfull'
                })
            }
        }
        return res.json({
            success: false,
            error: 'Invalid password or email'
        })
    } catch (error) {
        return res.json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const user = req.user;
        return res.json({ success: true, user })
    } catch (error) {
        return res.json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function getPublicImages(req: Request, res: Response) {
    try {
        const publishedImageMessages = await Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ])

        res.json({
            success: true,
            images: publishedImageMessages.reverse()
        })
    } catch (error) {
        return res.json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function logOut(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
  }
}
