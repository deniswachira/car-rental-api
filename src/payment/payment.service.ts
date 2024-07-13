import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TPaymentInsert,TPaymentSelect, paymentTable } from "../drizzle/schema";

export const getPaymentService = async ():Promise<TPaymentSelect[] | null>=> {
    return await db.query.paymentTable.findMany();    
}

export const getPaymentByIdService = async (payment_id:number):Promise<TPaymentSelect | undefined> => {
    return await db.query.paymentTable.findFirst({
       where: eq(paymentTable.payment_id, payment_id)
    })
}

export const insertPaymentService = async(payment:TPaymentInsert) => {
    await db.insert(paymentTable).values(payment)
    return "Payment inserted successfully 🎉"
    
    
}

export const updatePaymentService = async(payment_id:number,payment:TPaymentInsert) => {
    await db.update(paymentTable).set(payment).where(eq(paymentTable.payment_id,payment_id));
    return "Payment updated successfully 🎉"
}

export const deletePaymentService = async(payment_id:number) => {
    await db.delete(paymentTable).where(eq(paymentTable.payment_id,payment_id));
    return "Payment deleted successfully 🎉"
}

