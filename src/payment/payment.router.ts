import {Hono} from "hono"
import { deletePayment, getPaymentById, insertPayment, listAllPayments, updatePayment } from "./payment.controller";

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