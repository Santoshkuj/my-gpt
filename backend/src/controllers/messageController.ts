import { Request, Response } from "express";
import Chat from "../models/chat.js";
import openai from "../configs/openAi.js";
import User from "../models/user.js";
import getErrorMessage from "../utils.js";
import axios from "axios";
import imagekit from "../configs/imageKit.js";

export async function messageController(req: Request, res: Response) {
    try {
        const userId = req.user?._id
        const { chatId, promt } = req.body

        if (!req.user?.credits) {
            return res.json({
                success: false,
                error: 'You dont have enough credits'
            })
        }

        const chat = await Chat.findById(chatId)
        if (!chat || chat.userId.toString() !== userId?.toString()) { return res.status(404).json({ success: false, error: "Chat not found" }) }

        const userMessage = {
            role: 'user',
            content: promt,
            timestamp: Date.now(),
            isImage: false
        }

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: promt,
                },
            ],
        });

        const reply = {
            role: 'assistant',
            content: choices[0].message.content ?? "",
            timestamp: Date.now(),
            isImage: false
        }

        const result = await Chat.updateOne({ _id: chatId, userId }, {
            $push: {
                messages: {
                    $each: [userMessage, reply]
                }
            }
        })

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: "Chat updation failed" });
        }

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

        res.json({
            success: true,
            reply
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function imageController(req: Request, res: Response) {
    try {
        const userId = req.user?._id
        const { prompt, chatId, isPublished } = req.body

        if (!req.user?.credits || req.user?.credits < 2) {
            return res.json({
                success: false,
                error: 'You dont have enough credits'
            })
        }
        const chat = await Chat.findById(chatId)
        if (!chat || chat.userId.toString() !== userId?.toString()) {
            return res.status(404).json({
                success: false,
                error: 'Chat not found'
            })
        }
        const userMessage= {
            role: 'user',
            content: prompt,
            isImage: false,
            timestamp: Date.now()
        }

        const encodedPrompt = encodeURIComponent(prompt)

        const generateImageUrl = `${process.env.IMAGEKIT_URL}/ik-genimg-prompt-${encodedPrompt}/myGpt/${Date.now()}.png?tr=w-800,h-800`

        const imagekitRes = await axios.get(generateImageUrl,{responseType:'arraybuffer'})

        const base64Image = `data:image/png;base64,${Buffer.from(imagekitRes.data,'binary').toString('base64')}`

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'myGpt'
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
        const result = await Chat.updateOne({_id:chatId, userId},{
            $push:{
                $each: [userMessage, reply]
            }
        })
         if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: "Chat updation failed" });
        }
        await User.updateOne({_id: userId},{
            $inc: {credits: -2}
        })
         res.json({
            success: true,
            reply
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

