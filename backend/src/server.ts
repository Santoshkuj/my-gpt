import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser"

import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRouter.js'
import { stripeWebhooks } from './controllers/webHooks.js'

const PORT = process.env.PORT
const app = express()
await connectDB()
app.post('/api/stripe',express.raw({type:'application/json'}), stripeWebhooks)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/',(req:Request,res:Response)=> res.send('Server is live'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT} port`);
})