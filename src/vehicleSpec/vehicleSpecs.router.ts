import {Hono} from "hono"
import { deleteVehicleSpecs, getVehicleSpecsById, insertVehicleSpecs, listAllVehicleSpecs, updateVehicleSpecs} from "./vehicleSpecs.controller";

export const vehicleSpecsRouter = new Hono();

//get all states
vehicleSpecsRouter.get('/vehicles-spec', listAllVehicleSpecs)

//get state by id
vehicleSpecsRouter.get('/vehicles-spec/:vehicle_spec_id', getVehicleSpecsById)

//insert state
vehicleSpecsRouter.post('/vehicles-spec', insertVehicleSpecs)

//update state
vehicleSpecsRouter.put('/vehicles-spec/:vehicle_spec_id', updateVehicleSpecs)

//delete state
vehicleSpecsRouter.delete("/vehicles-spec/:vehicle_spec_id", deleteVehicleSpecs)

