import { Context } from "hono";
import dotenv from 'dotenv';
import { deletePaymentService, getPaymentByIdService, getPaymentsByUserIdService, getPaymentService, insertPaymentService, updatePaymentBySessionIdService, updatePaymentService } from "./payment.service";
import Stripe from 'stripe';
import { paymentTable } from "../drizzle/schema";
import { FRONTEND_URL } from "../proxxy/proxxy";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
//list of payments
export const listAllPayments = async (c: Context) => {
    try {
        const payment = await getPaymentService();
        if (payment === null) return c.text("No payment found");
        return c.json(payment, 200);
    } catch (error: any) {
        return c.text("Error while fetching payments");
    }
}

//get payment by id
export const getPaymentById = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id"));
    try {
        if (isNaN(payment_id)) return c.text("Invalid ID", 400);
        //search for payment    
        const payment = await getPaymentByIdService(payment_id);
        if (payment === undefined) return c.text("Payment not found", 404);
        return c.json(payment, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert payment
export const insertPayment = async (c: Context) => {
    try {
        const payment = await c.req.json();
        const createdPayment = await insertPaymentService(payment);
        if (createdPayment === undefined) return c.text("Payment not created 😒 ", 400);
        return c.json(createdPayment, 201);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update payment
export const updatePayment = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const payment_id = Number(c.req.param("payment_id"));
    const payment = await c.req.json();
    try {
        if (isNaN(payment_id)) return c.text("Invalid ID", 400);
        //search for payment
        const existingPayment = await getPaymentByIdService(payment_id);
        if (existingPayment === undefined) return c.text("Payment not found 😒", 404);
        //update payment
        const updatedPayment = await updatePaymentService(payment_id, payment);
        return c.json({ msg: updatedPayment }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete payment
export const deletePayment = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id"));
    try {
        if (isNaN(payment_id)) return c.text("Invalid ID", 400);
        //search for Payment
        const existingPayment = await getPaymentByIdService(payment_id);
        if (existingPayment === undefined) return c.text("Payment not found", 404);
        //delete Payment
        const deletedPayment = await deletePaymentService(payment_id);
        return c.json({ msg: deletedPayment }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//get all payment for one user
export const getPaymentsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.text("Invalid ID", 400);
        //search for payment    
        const payment = await getPaymentsByUserIdService(user_id);
        if (payment === null) return c.text("No payment found", 404);
        return c.json(payment, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

export const checkoutBooking = async (c: Context) => {
    let payment;
    try {
        payment = await c.req.json();
    } catch (error) {
        return c.text("Invalid request body", 400);
    }
    try {
        if (!payment.payment_id || !payment.payment_amount) {
            return c.text("Missing Payment ID or total amount", 400);
        }

        const conversionRate = 0.007;
        const totalAmountInUsd = payment.payment_amount * conversionRate;
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Payment ID: ${payment.payment_id}`,
                },
                unit_amount: Math.round(totalAmountInUsd * 100), // Convert to cents
            },
            quantity: 1,
        }];
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/success`,
            cancel_url: `${FRONTEND_URL}/failed`,
        };
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
        // Save payment details to the database
        const paymentDetails = {
            booking_id: payment.booking_id,
            user_id: payment.user_id,
            payment_amount: payment.payment_amount,
            payment_mode: 'card',
            session_id: session.id,
        };
        const createPayment = await insertPaymentService(paymentDetails);

        return c.json({ id: session.id, payment: createPayment }, 200);

    } catch (error: any) {
        return c.text(error?.message, 400);
    }
};

export const handleStripeWebhook = async (c: Context) => {
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.text();
    if (!sig) {
        console.error('Webhook Error: No stripe-signature header value was provided.');
        return c.text('Webhook Error: No stripe-signature header value was provided.', 400);
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        return c.text(`Webhook Error: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            // Update payment status in the database
            try {
                const session_id = session.id;
                const updateStatus = await updatePaymentBySessionIdService(session_id);
                return c.json({ payment: updateStatus }, 200);
            } catch (err: any) {
                return c.text(`Database Error: ${err.message}`, 500);
            }

        // Handle other event types as needed
        default:
            return c.text(`Unhandled event type ${event.type}`, 400);
    }
};

export default handleStripeWebhook;
