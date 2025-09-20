import { Document, Types } from 'mongoose'
import { Ichat } from './models/chat.ts';

export { }

declare global {
    interface IUser extends Document {
        _id?: Types.ObjectId
        name: string;
        email: string;
        password: string;
        credits: number;
    }

    interface Message {
        isImage: boolean;
        isPublished?: boolean,
        role: 'user' | 'assistant' | string,
        content: string,
        timestamp: number
    }
    interface IChat extends Document {
        userId: Types.ObjectId;
        name: string;
        userName: string;
        messages: Message[];
        createdAt?: Date;
        updatedAt?: Date;
    }

    type ChatInput = Pick<Ichat, 'userId' | 'name' | 'userName' | 'messages'>

}

declare module "express-serve-static-core" {
    interface Request {
        user?: IUser
    }
}