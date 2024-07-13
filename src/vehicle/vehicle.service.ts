import { eq, sql } from "drizzle-orm";
import db from "../drizzle/db";
type TRIVehicle = Array<{ vehicle_id: number }>;

import { TVehicleInsert,TVehicleSelect,vehicleSpecificationTable,vehicleTable } from "../drizzle/schema";


export const getVehiclesService = async ():Promise<TVehicleSelect[] | null>=> {
    return await db.query.vehicleTable.findMany();    
}

export const getVehicleByIdService = async (id:number):Promise<TVehicleSelect | undefined> => {
    return await db.query.vehicleTable.findFirst({
       where: eq(vehicleTable.vehicle_id, id)
    })
}

export const insertVehicleService = async(vehicle:TVehicleInsert): Promise <TRIVehicle | undefined> => {
  return await db.insert(vehicleTable).values(vehicle)
    .returning({vehicle_id:vehicleTable.vehicle_id})
    .execute();  
    
}

export const updateVehicleService = async(vehicle_id:number,state:TVehicleInsert) => {
    await db.update(vehicleTable).set(state).where(eq(vehicleTable.vehicle_id,vehicle_id));
    return "Vehicle updated successfully 🎉"
}

export const deleteVehicleService = async(vehicle_id:number) => {
    await db.delete(vehicleTable).where(eq(vehicleTable.vehicle_id,vehicle_id));
    return "Vehicle deleted successfully 🎉"
}

export const vehiclesWithSpecsService = async() => {
    return await db.query.vehicleTable.findMany({
        with: {
            vehicleSpec: true
        }
    });
}


export const vehicleByIdWithSpecsService = async (vehicle_id: number) => {
   try {
        const vehicle = await db.select()
            .from(vehicleTable)
            .leftJoin(vehicleSpecificationTable, eq(vehicleTable.vehicleSpec_id, vehicleSpecificationTable.vehicleSpec_id))
            .where(eq(vehicleTable.vehicle_id, vehicle_id))
            .execute();
return vehicle[0];
    } catch (error) {
        console.error('Error fetching vehicle with specs:', error);
        throw error;
    }
}

