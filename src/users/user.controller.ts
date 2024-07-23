import "dotenv/config";
import { Context } from "hono";
import { deleteUserService, getUserByIdService, getUsersService, updateUserService } from "./user.service";

//list all users
export const listUsers = async (c: Context) => {
    try {       

        const data = await getUsersService();
        if (data == null || data.length == 0) {
            return c.json({msg:"No Users Profile found 😒"}, 404);
        }
        // return the data with password hidden
        const users = data.map((profile) => {
            const { password, ...userWithoutPassword } = profile; // Destructure to exclude password
            return userWithoutPassword;
        });
        return c.json(users, 200);
        
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//get user by id
export const getUserById = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const user = await getUserByIdService(user_id);
    if (user == undefined) {
        return c.text("User not found 😒", 404);
    }
    return c.json(user, 200);
}

//update user
export const updateUser = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    const user = await c.req.json();
    try {
        // search for the user
        const searchedUser = await getUserByIdService(user_id);
        if (searchedUser == undefined) return c.json({msg:"User not found"}, 404);
        // get the data and update it
        const res = await updateUserService(user_id, user);
        // return a success message
        if (!res) return c.json({msg:"User not updated"}, 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

//delete user
export const deleteUser = async (c: Context) => {
    const user_id = Number(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("Invalid ID", 400);

    try {
        //search for the user
        const user = await getUserByIdService(user_id);
        if (user == undefined) return c.text("User not found", 404);
        //deleting the user
        const res = await deleteUserService(user_id);
        if (!res) return c.text("User not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

