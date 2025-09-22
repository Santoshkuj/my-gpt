import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import getErrorMessage from "../utils.js";

if (!process.env.JWT_SECRET) {
    throw new Error('jwt secret missing in environment variables')
}

const secret = process.env.JWT_SECRET
interface JwtPayload extends jwt.JwtPayload {
    id: string;
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    let token = req.cookies?.token
    if (!token) {
        console.log('token is missing');
        return res.status(401).json({
            success: false,
            error: 'Unauthenticated. Log in again'
        })
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload
        const userId = decoded.id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }
        req.user = user

        next()
    } catch (error) {
        res.status(500).json({
            error: getErrorMessage(error)
        })
    }
}