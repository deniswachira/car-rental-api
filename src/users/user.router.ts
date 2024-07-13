import {Hono} from 'hono';
import { zValidator } from '@hono/zod-validator';
import {updateUserValidator } from '../validators/user.validator';
import { deleteUser, getUserById, listUsers, updateUser } from './user.controller';
// import { adminRoleAuth } from '../middleWare/bearAuth';


export const userRouter = new Hono();

//get all users      api/users
userRouter.get("/users",listUsers);
//get a single user    api/users/1
userRouter.get("/users/:user_id", getUserById)

//update a user
userRouter.put("/users/:user_id", zValidator('json',updateUserValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}), updateUser)
//delete a user
userRouter.delete("/users/:user_id", deleteUser)

