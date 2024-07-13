import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TVehicleSpecificationInsert, TVehicleSpecificationSelect, vehicleSpecificationTable } from "../drizzle/schema";
type TRIVehicleSpec = {
    message: string;
};

export const getVehicleSpecsService = async ():Promise<TVehicleSpecificationSelect[] | null>=> {
    return await db.query.vehicleSpecificationTable.findMany();    
}

export const getVehicleSpecsByIdService = async (vehicleSpec_id:number):Promise<TVehicleSpecificationSelect | undefined> => {
    return await db.query.vehicleSpecificationTable.findFirst({
       where: eq(vehicleSpecificationTable.vehicleSpec_id, vehicleSpec_id)
    })
}

export const insertVehicleSpecsService = async(vehicleSpecs:TVehicleSpecificationInsert)  => {
    await db.insert(vehicleSpecificationTable).values(vehicleSpecs)  
    return "Vehicle Specs inserted successfully 🎉"
}

export const updateVehicleSpecsService = async(vehicleSpec_id:number,state:TVehicleSpecificationInsert) => {
    await db.update(vehicleSpecificationTable).set(state).where(eq(vehicleSpecificationTable.vehicleSpec_id,vehicleSpec_id));
    return "Vehicle Specs updated successfully 🎉"
}

export const deleteVehicleSpecsService = async(vehicleSpec_id:number) => {
    await db.delete(vehicleSpecificationTable).where(eq(vehicleSpecificationTable.vehicleSpec_id,vehicleSpec_id));
    return "Vehicle Specs deleted successfully 🎉"
}

