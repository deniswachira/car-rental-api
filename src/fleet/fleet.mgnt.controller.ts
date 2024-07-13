import { Context } from "hono";
import { deleteFleetMgntService, getFleetMgntByIdService, getFleetMgntsService, insertFleetMgntService, updateFleetMgntService } from "./fleet.mgnt.service";

//list of vehicles
export const listAllFleet = async (c: Context) => {
    try {
        const fleets = await getFleetMgntsService();
        if (fleets === null) return c.text("No vehicle found");
        return c.json(fleets, 200);
    } catch (error: any) {
        return c.text("Error while fetching fleets");
    }
}

//get vehicle by id
export const getFleetsById = async (c: Context) => {
    const fleet_id = parseInt(c.req.param("fleet_id"));
    try {
        if (isNaN(fleet_id)) return c.text("Invalid ID", 400);
        //search for vehicle    
        const fleet = await getFleetMgntByIdService(fleet_id);   
        if (fleet === undefined) return c.text("Fleet not found", 404);
        return c.json(fleet, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert vehicle
export const insertFleets = async (c: Context) => {
    try {
        const fleet = await c.req.json();
        const createdFleet = await insertFleetMgntService(fleet);
        if (createdFleet === undefined) return c.text("fleet not created 😒 ", 400);
            return c.json(createdFleet, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update vehicle
export const updateFleets = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const fleet_id = Number(c.req.param("fleet_id"));
    const fleet = await c.req.json();
    try {
        if (isNaN(fleet_id)) return c.text("Invalid ID", 400);
        //search for fleet
        const existingFleet = await getFleetMgntByIdService(fleet_id);
        if (existingFleet === undefined) return c.text("Fleet not found 😒", 404);
        //update fleet
        const updatedFleet = await updateFleetMgntService(fleet_id, fleet);
        return c.json({ msg: updatedFleet }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete vehicle
export const deleteFleets = async (c: Context) => {
    const fleet_id = parseInt(c.req.param("fleet_id"));
    try {
        if (isNaN(fleet_id)) return c.text("Invalid ID", 400);
        //search for fleet
        const existingFleet = await getFleetMgntByIdService(fleet_id);
        if (existingFleet === undefined) return c.text("Fleet not found", 404);
        //delete fleet
        const deletedFleet = await deleteFleetMgntService(fleet_id);
        return c.json({ msg: deletedFleet }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

