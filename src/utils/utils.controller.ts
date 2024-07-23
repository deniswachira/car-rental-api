import { Context } from "hono";
import { createLogService, getAllLogsByUserIdService } from "./utils.service";

//add a new log
export const addLog = async (c: Context) => {
    const log = await c.req.json();
    try {
        // create a new log
        const res = await createLogService(log);
        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//getAllLogsByUserId
export const getAllLogsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const logs = await getAllLogsByUserIdService(user_id);
    if (logs == null) {
        return c.text("Logs not found 😒", 404);
    }
    return c.json(logs, 200);
}