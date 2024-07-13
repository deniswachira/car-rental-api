import { Context } from "hono";
import { deletePaymentService, getPaymentByIdService, getPaymentService, insertPaymentService, updatePaymentService } from "./payment.service";

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

//delete vehicle
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

