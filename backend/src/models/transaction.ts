import { InferSchemaType, model, Schema } from "mongoose";


const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true},
    amount: { type: Number, required: true},
    credits: { type: Number, required: true},
    isPaid: { type: Boolean, default: false}
},{
    timestamps: true,
})

type TransactionType = InferSchemaType<typeof transactionSchema>;
export type TransactionInput = Omit<TransactionType, "createdAt" | "updatedAt">;

const Transaction = model<TransactionType>("Transaction", transactionSchema);

export default Transaction
