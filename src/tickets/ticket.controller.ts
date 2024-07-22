import { Context } from "hono";
import { deleteTicketService, getAllTicketsByUserIdService, getTicketByUserIdService, getTicketsService, insertTicketService, updateTicketService } from "./ticket.service";

//list of tickets
export const listAllTickets = async (c: Context) => {
    try {
        const tickets = await getTicketsService();
        if (tickets === null) return c.text("No ticket found");
        return c.json(tickets, 200);
    } catch (error: any) {
        return c.text("Error while fetching tickets");
    }
}

//get tickets by id
export const getTicketByUserId = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));
    try {
        if (isNaN(ticket_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for tickets
        const ticket = await getTicketByUserIdService(ticket_id);   
        if (ticket === undefined) return c.json({ msg:"ticket not found"}, 404);
        return c.json(ticket, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert tickets
export const insertTicket = async (c: Context) => {
    try {
        const ticket = await c.req.json();
        const createdticket = await insertTicketService(ticket);
        if (createdticket === undefined) return c.json({ msg:"ticket not created 😒 "}, 400);
        return c.json(createdticket, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update tickets
export const updateTicket = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const ticket_id = Number(c.req.param("ticket_id"));
    const ticket = await c.req.json();
    try {
        if (isNaN(ticket_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for tickets
        const existingTicket = await getTicketByUserIdService(ticket_id);
        if (existingTicket === undefined) return c.json({msg:"Ticket not found 😒"}, 404);
        //update tickets
        const updatedTicket = await updateTicketService(ticket_id, ticket);
        return c.json({ msg: updatedTicket }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//get tickets by user id
export const getTicketsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for tickets
        const tickets = await getAllTicketsByUserIdService(user_id);
        if (tickets === undefined) return c.json({msg:"Tickets not found"}, 404);
        return c.json(tickets, 200);
    } catch (error: any) {
        return c.json(error?.message, 400);
    }
}

//delete tickets
export const deleteTicket = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));

    if (isNaN(ticket_id)) {
        return c.json({ error: 'Invalid ticket ID' }, 400);
    }
    try {
        const ticket = await deleteTicketService(ticket_id);
        if (!ticket) {
            return c.json({ msg: 'Ticket not found' }, 404);
        }
        return c.json(ticket, 200);
    } catch (error) {
        return c.json({ msg: 'Failed to delete ticket' }, 500);
    }
}

// export const getVehicleByIdWithSpecs = async(c:Context) => {
//       const vehicle_id = parseInt(c.req.param('vehicle_id'));

//     if (isNaN(vehicle_id)) {
//         return c.json({ error: 'Invalid vehicle ID' }, 400);
//     }
//     try {
//         const vehicle = await vehicleByIdWithSpecsService(vehicle_id);
//         if (!vehicle) {
//             return c.json({ msg: 'Vehicle not found' }, 404);
//         }
//         return c.json(vehicle, 200);
//     } catch (error) {
//         return c.json({ msg: 'Failed to fetch vehicle' }, 500);
//     }
// }