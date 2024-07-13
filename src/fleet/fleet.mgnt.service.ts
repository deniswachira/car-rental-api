import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TFleetManagementSelect, TFleetManagementInsert, fleetManagementTable } from "../drizzle/schema";

export const getFleetMgntsService = async ():Promise<TFleetManagementSelect[] | null>=> {
    return await db.query.fleetManagementTable.findMany();    
}

export const getFleetMgntByIdService = async (fleet_id:number):Promise<TFleetManagementSelect | undefined> => {
    return await db.query.fleetManagementTable.findFirst({
       where: eq(fleetManagementTable.fleet_id, fleet_id)
    })
}

export const insertFleetMgntService = async(fleet:TFleetManagementInsert) => {
    return await db.insert(fleetManagementTable).values(fleet)
    .returning({fleet_id:fleetManagementTable.fleet_id})
    .execute();
    }

export const updateFleetMgntService  = async(fleet_id:number,fleet:TFleetManagementInsert) => {
    await db.update(fleetManagementTable).set(fleet).where(eq(fleetManagementTable.fleet_id,fleet_id));
    return "Fleet updated successfully 🎉"
}

export const deleteFleetMgntService = async(fleet_id:number) => {
    await db.delete(fleetManagementTable).where(eq(fleetManagementTable.fleet_id,fleet_id));
    return "Fleet deleted successfully 🎉"
}

