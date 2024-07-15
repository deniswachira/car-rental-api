import { Context } from "hono";

import { deleteBookingService, getAllBokingsWithUserAndVehicleService, getBookingByIdService, getBookingsByUserIdService, getBookingsService, insertBookingService, updateBookingService } from "./booking.service";

import { insertPaymentService } from "../payment/payment.service";


//list of vehicles
export const listAllBookings = async (c: Context) => {
    try {
        const bookings = await getBookingsService();
        if (bookings === null) return c.text("No bookings found");
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.text("Error while fetching booking");
    }
}

//get vehicle by id
export const getBookingById = async (c: Context) => {
    const booking_id = parseInt(c.req.param("booking_id"));
    try {
        if (isNaN(booking_id)) return c.text("Invalid ID", 400);
        //search for vehicle    
        const booking = await getBookingByIdService(booking_id);   
        if (booking === undefined) return c.text("Booking not found", 404);
        return c.json(booking, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert vehicle
export const insertBooking = async (c: Context) => {
    try {
        const booking = await c.req.json();
        const createdBooking = await insertBookingService(booking);
        if (createdBooking === undefined) return c.json({msg:"Booking not created 😒 "}, 400);
            return c.json(createdBooking, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update vehicle
export const updateBooking = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const booking_id = Number(c.req.param("booking_id"));
    const booking = await c.req.json();
    try {
        if (isNaN(booking_id)) return c.text("Invalid ID", 400);
        //search for booking
        const existingBooking = await getBookingByIdService(booking_id);
        if (existingBooking === undefined) return c.text("Booking not found 😒", 404);
        //update booking
        const updatedVehicle = await updateBookingService(booking_id, booking);
        return c.json({ msg: updatedVehicle }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete vehicle
export const deleteBooking = async (c: Context) => {
    const booking_id = parseInt(c.req.param("booking_id"));
    try {
        if (isNaN(booking_id)) return c.text("Invalid ID", 400);
        //search for Booking
        const existingBooking = await getBookingByIdService(booking_id);
        if (existingBooking === undefined) return c.json({msg:"Booking not found "}, 404);
        //delete Booking
        const deletedBooking = await deleteBookingService(booking_id);
        return c.json({ msg: deletedBooking }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//get bookings by user id
export const getBookingsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.text("Invalid ID", 400);
        //search for booking    
        const bookings = await getBookingsByUserIdService(user_id);   
        if (bookings === null) return c.text("No bookings found", 404);
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

export const getAllBokingsWithUserAndVehicle = async (c: Context) => {
    try {
        const bookings = await getAllBokingsWithUserAndVehicleService();
        if (bookings === null) return c.text("No bookings found");
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.text("Error while fetching booking");
    }
}


