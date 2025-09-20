import { Request, Response } from "express";
import getErrorMessage, { plans } from "../utils.js";
import Transaction, { TransactionInput } from "../models/transaction.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!)

export async function getPlans(req: Request, res: Response) {
    try {
        res.json({
            success: true,
            plans
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}

export async function purchasePlan(req: Request, res: Response) {
    try {
        const { planId } = req.body
        const userId = req.user?._id
        const { origin } = req.headers

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'unauthenticated'
            })
        }
        const plan = plans.find(plan => plan._id === planId)

        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Invalid plan'
            })
        }
        const transaction = await Transaction.create<TransactionInput>({
            userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false,
        })

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: plan.price * 100,
                        product_data: {
                            name: plan.name
                        }
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata: { transactionId: transaction._id.toString(), appId: 'my-Gpt' },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60
        });

        res.json({
            success: true,
            url: session.url
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: getErrorMessage(error)
        })
    }
}