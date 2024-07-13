import { Context } from "hono";
import { deleteVehicleService, getVehicleByIdService, getVehiclesService, insertVehicleService, updateVehicleService, vehicleByIdWithSpecsService, vehiclesWithSpecsService } from "./vehicle.service";

//list of vehicles
export const listAllVehicles = async (c: Context) => {
    try {
        const vehicles = await getVehiclesService();
        if (vehicles === null) return c.text("No vehicle found");
        return c.json(vehicles, 200);
    } catch (error: any) {
        return c.text("Error while fetching vehicles");
    }
}

//get vehicle by id
export const getVehicleById = async (c: Context) => {
    const vehicle_id = parseInt(c.req.param("vehicle_id"));
    try {
        if (isNaN(vehicle_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for vehicle    
        const vehicle = await getVehicleByIdService(vehicle_id);   
        if (vehicle === undefined) return c.json({msg:"Vehicle not found"}, 404);
        return c.json(vehicle, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert vehicle
export const insertVehicle = async (c: Context) => {
    try {
        const vehicle = await c.req.json();
        const createdVehicle = await insertVehicleService(vehicle);
        if (createdVehicle === undefined) return c.json({msg:"Vehicle not created 😒 "}, 400);
            return c.json(createdVehicle, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update vehicle
export const updateVehicle = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const vehicle_id = Number(c.req.param("vehicle_id"));
    const vehicle = await c.req.json();
    try {
        if (isNaN(vehicle_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for vehicle
        const existingVehicle = await getVehicleByIdService(vehicle_id);
        if (existingVehicle === undefined) return c.json({msg:"Vehicle not found 😒"}, 404);
        //update vehicle
        const updatedVehicle = await updateVehicleService(vehicle_id, vehicle);
        return c.json({ msg: updatedVehicle }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete vehicle
export const deleteVehicle = async (c: Context) => {
    const vehicle_id = parseInt(c.req.param("vehicle_id"));
    try {
        if (isNaN(vehicle_id)) return c.json({msg:"Invalid ID"}, 400);
        //search for state
        const existingVehicle = await getVehicleByIdService(vehicle_id);
        if (existingVehicle === undefined) return c.json({msg:"Vehicle not found"}, 404);
        //delete state
        const deletedVehicle = await deleteVehicleService(vehicle_id);
        return c.json({ msg: deletedVehicle }, 200);
    } catch (error: any) {
        return c.json(error?.message, 400);
    }
}

export const getVehiclesWithSpecs = async(c:Context) => {
    try {
        const vehiclesWithSpecs = await vehiclesWithSpecsService();
        if (vehiclesWithSpecs === null) return c.json({msg:"No vehicles with specs found"}, 404);
        return c.json(vehiclesWithSpecs, 200);
    } catch (error: any) {
        return c.json({msg:"Error while fetching vehicles with specs"}, 400);
    }
}

export const getVehicleByIdWithSpecs = async(c:Context) => {
      const vehicle_id = parseInt(c.req.param('vehicle_id'));

    if (isNaN(vehicle_id)) {
        return c.json({ error: 'Invalid vehicle ID' }, 400);
    }
    try {
        const vehicle = await vehicleByIdWithSpecsService(vehicle_id);
        if (!vehicle) {
            return c.json({ msg: 'Vehicle not found' }, 404);
        }
        return c.json(vehicle, 200);
    } catch (error) {
        return c.json({ msg: 'Failed to fetch vehicle' }, 500);
    }
}