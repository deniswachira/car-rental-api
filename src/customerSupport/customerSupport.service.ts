import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TCustomerSupportInsert,TCustomerSupportSelect,customerSupportTable } from "../drizzle/schema";

export const getTicketsService = async ():Promise<TCustomerSupportSelect[] | null>=> {
    return await db.query.customerSupportTable.findMany();    
}

export const getTicketByIdService = async (ticket_id:number):Promise<TCustomerSupportSelect | undefined> => {
    return await db.query.customerSupportTable.findFirst({
       where: eq(customerSupportTable.ticket_id, ticket_id)
    })
}

export const insertTicketService = async(ticket:TCustomerSupportInsert) => {
    const result = await db.insert(customerSupportTable).values(ticket)
    .returning({ticket_id:customerSupportTable.ticket_id, user_id:customerSupportTable.user_id,ticket_subject:customerSupportTable.ticket_subject,ticket_description:customerSupportTable.ticket_description, ticket_status:customerSupportTable.ticket_status})
    .execute();
    if (result) {
        // Assuming result is an array with the inserted book as the first item
        const createdTicket = result[0];
        return createdTicket;
    } else {
        throw new Error("Failed to Create Ticket 😒");
    }
    
}

export const updateTicketService = async(ticket_id:number,ticket:TCustomerSupportInsert) => {
    await db.update(customerSupportTable).set(ticket).where(eq(customerSupportTable.ticket_id,ticket_id));
    return "Ticket updated successfully 🎉"
}

export const deleteTicketService = async(ticket_id:number) => {
    await db.delete(customerSupportTable).where(eq(customerSupportTable.ticket_id,ticket_id));
    return "Ticket deleted successfully 🎉"
}

