import {Hono} from "hono"
import { deleteTicket, getTicketById, insertTicket, listAllTickets, updateTicket } from "./customerSupport.controller";
import { createTicketValidator, updateTicketValidator } from "../validators/ticket.validator copy";
import { zValidator } from "@hono/zod-validator";

export const ticketRouter = new Hono();

//get all Ticket
ticketRouter.get('/tickets', listAllTickets)

//get Ticket by id
ticketRouter.get('/tickets/:ticket_id', getTicketById)

//insert Ticket
ticketRouter.post('/tickets',zValidator('json',createTicketValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}), insertTicket)

//update Ticket
ticketRouter.put('/tickets/:ticket_id',zValidator('json',updateTicketValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}), updateTicket)

//delete Ticket
ticketRouter.delete("/tickets/:ticket_id", deleteTicket)
