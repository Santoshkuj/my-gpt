import { Request, Response } from "express";
import Chat from "../models/chat.js";
import getErrorMessage from "../utils.js";

export async function createChat(req:Request, res:Response) {
    try {
        const userId = req.user?._id

        const chatData:ChatInput ={
            userId: userId!,
            messages:[],
            name: 'New chat',
            userName: req.user?.name!
        }
        await Chat.create(chatData)

        res.json({
            success: true,
            message:'Chat created'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function getChats(req:Request, res:Response) {
    try {
        const userId = req.user?._id
        const chats = await Chat.find({userId}).sort({updatedAt: -1})

        res.json({
            success: true,
            chats
        })
    } catch (error) {
         res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function deleteChats(req:Request, res:Response) {
    try {
        const userId = req.user?._id
        const {chatId} = req.body
        
        await Chat.deleteOne({_id:chatId, userId})

        res.json({
            success: true,
            message:'chat deleted'
        })
    } catch (error) {
         res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}