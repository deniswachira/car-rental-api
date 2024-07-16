import {Hono} from "hono"
import { checkoutBooking, deletePayment, getPaymentByBookingId, getPaymentById, getPaymentsByUserId, insertPayment, listAllPayments, updatePayment } from "./payment.controller";

export const paymentRouter = new Hono();

//get all states
paymentRouter.get('/payments', listAllPayments)

//get state by id
paymentRouter.get('/payments/:payment_id', getPaymentById)

//insert state
paymentRouter.post('/payments', insertPayment)

//update state
paymentRouter.put('/payments/:payment_id', updatePayment)

//delete state
paymentRouter.delete("/payments/:payment_id", deletePayment)

//get all payment for one user
paymentRouter.get('/payments-with-user-id/:user_id', getPaymentsByUserId)

//get paymet using booking id
paymentRouter.get('/payment-by-booking-id/:booking_id', getPaymentByBookingId)

//checkout payment
paymentRouter.post("/create-checkout-session/:booking_id", checkoutBooking)

