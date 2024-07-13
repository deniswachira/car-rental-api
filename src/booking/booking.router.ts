import { Hono } from "hono"
import { checkoutBooking, deleteBooking, getAllBokingsWithUserAndVehicle, getBookingById, getBookingsByUserId, insertBooking, listAllBookings, updateBooking } from "./booking.controller";
import { createBookingValidator, updateBookingValidator } from "../validators/booking.validator";
import { zValidator } from "@hono/zod-validator";

export const bookingRouter = new Hono();

//get all states
bookingRouter.get('/bookings', listAllBookings)

//get state by id
bookingRouter.get('/bookings/:booking_id', getBookingById)

//insert state
bookingRouter.post('/bookings', zValidator('json', createBookingValidator, (result, c) => {
    if (!result.success) return c.text(result.error.message + "😒", 400)
}),insertBooking)

//update state
bookingRouter.put('/bookings/:booking_id', zValidator('json', updateBookingValidator, (result, c) => {
    if (!result.success) return c.text(result.error.message + "😒", 400)
}),
    updateBooking)

//delete state
bookingRouter.delete("users/:booking_id/bookings", deleteBooking)

//get bookings by user id
bookingRouter.get("/users/:user_id/bookings", getBookingsByUserId)

//get bookings with user details
bookingRouter.get("/bookings-user-with-userdetails", getAllBokingsWithUserAndVehicle)

//checkout booking
bookingRouter.post("/create-checkout-session/:booking_id", checkoutBooking)
