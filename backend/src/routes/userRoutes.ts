import { Router } from "express";
import { getPublicImages, getUser, loginUser, logOut, registerUser } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',logOut)
userRouter.get('/data',auth,getUser)
userRouter.get('/published-images',auth,getPublicImages)

export default userRouter;