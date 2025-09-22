import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createChat, deleteChats, getChats } from "../controllers/chatController.js";

const chatRouter = Router()

chatRouter.get('/create',auth,createChat)
chatRouter.get('/get',auth,getChats)
chatRouter.post('/delete',auth,deleteChats)

export default chatRouter