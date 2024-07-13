import { Context } from "hono";
import { deleteVehicleSpecsService, getVehicleSpecsByIdService, getVehicleSpecsService, insertVehicleSpecsService, updateVehicleSpecsService } from "./vehicleSpecs.service";


//list of vehiclesSpecs
export const listAllVehicleSpecs = async (c: Context) => {
    try {
        const vehicleSpecs = await getVehicleSpecsService();
        if (vehicleSpecs === null) return c.text("No vehicle Specs found");
        return c.json(vehicleSpecs, 200);
    } catch (error: any) {
        return c.text("Error while fetching vehicles Specs");
    }
}

//get vehiclesSpecs by id
export const getVehicleSpecsById = async (c: Context) => {
    const vehicle_spec_id = parseInt(c.req.param("vehicle_spec_id"));
    try {
        if (isNaN(vehicle_spec_id)) return c.text("Invalid ID", 400);
        //search for vehicle    
        const vehicleSpecs = await getVehicleSpecsByIdService(vehicle_spec_id);   
        if (vehicleSpecs === undefined) return c.text("Vehicle Specs not found", 404);
        return c.json(vehicleSpecs, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}
// insert vehiclesSpecs
export const insertVehicleSpecs = async (c: Context) => {
    try {
        const vehicleSpecs = await c.req.json();

        const createdVehicleSpecs = await insertVehicleSpecsService(vehicleSpecs);
        if (createdVehicleSpecs === undefined) return c.json({msg: "Vehicle Specs not created 😒 "}, 400);
            return c.json({msg:createdVehicleSpecs}, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update vehiclesSpecs
export const updateVehicleSpecs = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const vehicle_spec_id = Number(c.req.param("vehicle_spec_id"));
    const vehicle_spec = await c.req.json();
    try {
        if (isNaN(vehicle_spec_id)) return c.text("Invalid ID", 400);
        //search for vehiclesSpecs
        const existingVehicleSpecs = await getVehicleSpecsByIdService(vehicle_spec_id);
        if (existingVehicleSpecs === undefined) return c.text("Vehicle SPecs not found 😒", 404);
        //update vehiclesSpecs
        const updatedVehicleSpecs = await updateVehicleSpecsService(vehicle_spec_id, vehicle_spec);
        return c.json({ msg: updatedVehicleSpecs }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete vehiclesSpecs
export const deleteVehicleSpecs = async (c: Context) => {
    const vehicle_spec_id = parseInt(c.req.param("vehicle_spec_id"));
    try {
        if (isNaN(vehicle_spec_id)) return c.text("Invalid ID", 400);
        //search for vehiclesSpecs
        const existingVehicleSpecs = await getVehicleSpecsByIdService(vehicle_spec_id);
        if (existingVehicleSpecs === undefined) return c.text("Vehicle Specs not found", 404);
        //delete vehiclesSpecs
        const deletedVehicleSpecs = await deleteVehicleSpecsService(vehicle_spec_id);
        return c.json({ msg: deletedVehicleSpecs }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

