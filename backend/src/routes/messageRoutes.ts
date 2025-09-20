import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { messageController, imageController } from "../controllers/messageController.js";

const messageRouter = Router()

messageRouter.post('/text',auth, messageController)
messageRouter.post('/image',auth, imageController)

export default messageRouter