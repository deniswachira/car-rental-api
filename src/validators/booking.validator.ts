import { z } from 'zod';

export const createBookingValidator = z.object({
    user_id: z.number(),
    vehicle_id: z.number(),
    booking_date: z.string(),
    returning_date: z.string(),
    location: z.string(),
    total_amount: z.number()
});

export const updateBookingValidator = z.object({
    user_id: z.number().optional(),
    vehicle_id: z.number().optional(),
    booking_date: z.string().optional(),
    returning_date: z.string().optional(),
    total_amount: z.number().optional(),
    booking_status: z.string().optional(),
    location: z.string().optional()
});