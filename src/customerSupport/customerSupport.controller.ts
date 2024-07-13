import { Context } from "hono";
import { deleteTicketService, getTicketByIdService, getTicketsService, insertTicketService, updateTicketService } from "./customerSupport.service";

//list of Tickets
export const listAllTickets = async (c: Context) => {
    try {
        const ticket = await getTicketsService();
        if (ticket === null) return c.text("No ticket found");
        return c.json(ticket, 200);
    } catch (error: any) {
        return c.text("Error while fetching tickets");
    }
}

//get ticket by id
export const getTicketById = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));
    try {
        if (isNaN(ticket_id)) return c.text("Invalid ID", 400);
        //search for ticket    
        const ticket = await getTicketByIdService(ticket_id);   
        if (ticket === undefined) return c.text("Ticket not found", 404);
        return c.json(ticket, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert ticket
export const insertTicket = async (c: Context) => {
    try {
        const ticket = await c.req.json();
        const createdTicket = await insertTicketService(ticket);
        if (createdTicket === undefined) return c.text("Ticket not created 😒 ", 400);
            return c.json(createdTicket, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update ticket
export const updateTicket = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const ticket_id = Number(c.req.param("ticket_id"));
    const ticket = await c.req.json();
    try {
        if (isNaN(ticket_id)) return c.text("Invalid ID", 400);
        //search for Ticket
        const existingPayment = await getTicketByIdService(ticket_id);
        if (existingPayment === undefined) return c.text("Payment not found 😒", 404);
        //update Ticket
        const updatedPayment = await updateTicketService(ticket_id, ticket);
        return c.json({ msg: updatedPayment }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete Ticket
export const deleteTicket = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));
    try {
        if (isNaN(ticket_id)) return c.text("Invalid ID", 400);
        //search for Ticket
        const existingTicket = await getTicketByIdService(ticket_id);
        if (existingTicket === undefined) return c.text("Ticket not found", 404);
        //delete Ticket
        const deletedTicket = await deleteTicketService(ticket_id);
        return c.json({ msg: deletedTicket }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

