import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createChat, getChats } from "../controllers/chatController.js";

const chatRouter = Router()

chatRouter.get('/create',auth,createChat)
chatRouter.get('/get',auth,getChats)
chatRouter.post('/delete',auth,getChats)

export default chatRouter