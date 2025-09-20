import { model, Schema } from "mongoose";

const chatSchema = new Schema<IChat>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    userName: {type: String, required: true},
    name: {type: String, required: true},
    messages: [
        {
            isImage : {type: Boolean, required: true},
            isPublished: {type: Boolean, default: false},
            role: {type: String, required: true},
            content: {type: String, required: true},
            timestamp: {type: Number, required: true},
        }
    ]
},{
    timestamps: true
})


const Chat = model<IChat>('Chat', chatSchema)

export default Chat