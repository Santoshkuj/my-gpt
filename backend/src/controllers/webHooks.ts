import { Request, Response } from "express";
import Stripe from "stripe";
import getErrorMessage from "../utils.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";


export async function stripeWebhooks(req: Request, res: Response) {
    const stripe = new Stripe(process.env.STRIPE_SECRET!)
    const sig = req.headers["stripe-signature"]
    console.log('webhook verifying');

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('stripe webhook secret is missing in environement variables')
    }
    if (!sig) {
        return res.status(400).json({
            success: false,
            error: 'Stripe signature missing'
        })
    }
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${getErrorMessage(error)}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object
                const sessionlist = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })
                const session = sessionlist.data[0]
                const { transactionId, appId } = session.metadata!
                console.log(transactionId,'transactionId', appId, 'appid');

                if (appId === 'my-Gpt') {
                    const transaction = await Transaction.findOneAndUpdate({
                        _id: transactionId,
                        isPaid: false
                    }, {
                        isPaid: true
                    })

                    await User.updateOne({ _id: transaction?.userId }, {
                        $inc: {
                            credits: transaction?.credits
                        }
                    })
                } else {
                    return res.json({
                        received: true,
                        message: 'Ingnored event: Invalid app'
                    })
                }
                break;
            }

            default:
                console.log("Unhandled event type: ", event.type)
                break;
        }
        res.json({ received: true })
    } catch (error) {
        console.log('webhook error', error);
        res.status(500).send('Internal server error')
    }
}