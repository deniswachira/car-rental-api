import { eq, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { TBookingInsert,TBookingSelect,bookingTable } from "../drizzle/schema";

type TRIBooking = Array<{ booking_id: number }>;

export const getBookingsService = async ():Promise<TBookingSelect[] | null>=> {
    return await db.query.bookingTable.findMany();    
}

export const getBookingByIdService = async (booking_id:number):Promise<TBookingSelect | undefined> => {
    return await db.query.bookingTable.findFirst({
       where: eq(bookingTable.booking_id, booking_id)
    })
}

export const insertBookingService = async(booking:TBookingInsert): Promise <TRIBooking | undefined> => {
    return await db.insert(bookingTable).values(booking)
    .returning({booking_id:bookingTable.booking_id})
    .execute();
   
}

export const updateBookingService= async(booking_id:number,booking:TBookingInsert) => {
    await db.update(bookingTable).set(booking).where(eq(bookingTable.booking_id,booking_id));
    return "Booking updated successfully 🎉"
}

export const deleteBookingService = async(booking_id:number) => {
    await db.delete(bookingTable).where(eq(bookingTable.booking_id,booking_id));
    return "Booking deleted successfully 🎉"
}

export const getBookingsByUserIdService = async (user_id:number):Promise<TBookingSelect[] | null>=> {
    return await db.query.bookingTable.findMany({
        where: eq(bookingTable.user_id, user_id)
    });    
}

export const getAllBokingsWithUserAndVehicleService = async ():Promise<TBookingSelect[] | null>=> {
    return await db.query.bookingTable.findMany({
        with: {
            user: {
                columns:{
                    user_id:false,
                    full_name:true,
                    email:true
                }
            },
            
        }
    });    
}

