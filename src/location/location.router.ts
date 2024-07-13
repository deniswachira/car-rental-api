import {Hono} from "hono"
import { listAllBookings } from "../booking/booking.controller";
import { deleteBranch, getBranchById, insertBranch, updateBranch } from "./location.controller";

export const branchRouter = new Hono();

//get all states
branchRouter.get('/branches', listAllBookings)

//get state by id
branchRouter.get('/branches/:booking_id', getBranchById)

//insert state
branchRouter.post('/branches', insertBranch)

//update state
branchRouter.put('/branches/:branch_id', updateBranch)

//delete state
branchRouter.delete("/branches/:branch_id", deleteBranch)
