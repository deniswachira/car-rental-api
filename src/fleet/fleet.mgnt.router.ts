import {Hono} from "hono"
import { deleteFleets, getFleetsById, insertFleets, listAllFleet, updateFleets } from "./fleet.mgnt.controller";


export const fleetMgntRouter = new Hono();

//get all states
fleetMgntRouter.get('/fleet-mgnts', listAllFleet)

//get state by id
fleetMgntRouter.get('/fleet-mgnts/:fleet-mgnt_id', getFleetsById)

//insert state
fleetMgntRouter.post('/fleet-mgnts', insertFleets)

//update state
fleetMgntRouter.put('/fleet-mgnts/:fleet-mgnt_id', updateFleets)

//delete state
fleetMgntRouter.delete("/fleet-mgnts/:fleet-mgnt_id", deleteFleets)

