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
//update payment using session id
export const updatePaymentBySessionIdService = async (session_id: string) => {
    await db.update(paymentTable).set({payment_status: "paid"}).where(eq(paymentTable.session_id,session_id));
    return "Payment updated successfully 🎉"
}

export const deletePaymentService = async(payment_id:number) => {
    await db.delete(paymentTable).where(eq(paymentTable.payment_id,payment_id));
    return "Payment deleted successfully 🎉"
}

//get all payment for one user and join them booking table and vehicle table
export const getPaymentsByUserIdService = async (user_id: number): Promise<TPaymentSelect[] | null> => {
    return await db.query.paymentTable.findMany({
        where: eq(paymentTable.user_id, user_id),
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    booking_date: true,
                    returning_date: true,
                    booking_status: true,
                    vehicle_id: true
                },
                with: {
                    vehicle: {
                        columns: {
                            vehicle_id: true,
                            vehicleSpec_id: true
                        },
                        with: {
                            vehicleSpec: {
                                columns: {
                                    vehicle_name: true,
                                    vehicle_model: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

//get payment using booking id
export const getPaymentByBookingIdService = async (booking_id: number)=> {
    return await db.query.paymentTable.findFirst({
        where: eq(paymentTable.booking_id, booking_id)
    })
}

//get all payment
export const listAllPaymentsService = async () => {
    return await db.query.paymentTable.findMany({
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    booking_date: true,
                    returning_date: true,
                    booking_status: true,
                    vehicle_id: true
                },
                with: {
                    vehicle: {
                        columns: {
                            vehicle_id: true,
                            vehicleSpec_id: true
                        },
                        with: {
                            vehicleSpec: {
                                columns: {
                                    vehicle_name: true,
                                    vehicle_model: true,
                                }
                            }
                        }
                    }
                }
            },
            user: {
                columns: {
                    user_id: true,
                    full_name: true,
                    email: true
                }
            }
        }
    });
}

//print all payment on excel sheet
export const printAllPaymentsService = async () => {
    return await db.query.paymentTable.findMany({
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    booking_date: true,
                    returning_date: true,
                    booking_status: true,
                    vehicle_id: true
                },
                with: {
                    vehicle: {
                        columns: {
                            vehicle_id: true,
                            vehicleSpec_id: true
                        },
                        with: {
                            vehicleSpec: {
                                columns: {
                                    vehicle_name: true,
                                    vehicle_model: true,
                                }
                            }
                        }
                    }
                }
            },
            user: {
                columns: {
                    user_id: true,
                    full_name: true,
                    email: true
                }
            }
        }
    });
}