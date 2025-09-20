import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { getPlans, purchasePlan } from "../controllers/creditController.js";

const creditRouter = Router()

creditRouter.get('/plan',auth,getPlans)
creditRouter.get('/purchase',auth,purchasePlan)

export default creditRouter