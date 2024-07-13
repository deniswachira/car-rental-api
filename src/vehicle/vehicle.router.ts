import {Hono} from "hono"
import { deleteVehicle, getVehicleById, getVehicleByIdWithSpecs, getVehiclesWithSpecs, insertVehicle, listAllVehicles, updateVehicle } from "./vehicle.controller";

export const vehicleRouter = new Hono();

//get all states
vehicleRouter.get('/vehicles', listAllVehicles)

//get state by id
vehicleRouter.get('/vehicles/:vehicle_id', getVehicleById)

//insert state
vehicleRouter.post('/vehicles', insertVehicle)

//update state
vehicleRouter.put('/vehicles/:vehicle_id', updateVehicle)

//delete state
vehicleRouter.delete("/vehicles/:vehicle_id", deleteVehicle)

//get vehicles with specs
vehicleRouter.get("/vehicles-with-specs", getVehiclesWithSpecs)

//get vehicle by id with specs
vehicleRouter.get("/vehicles-with-specs/:vehicle_id", getVehicleByIdWithSpecs)
