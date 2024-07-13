import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TUserInsert,TUserSelect, userTable  } from "../drizzle/schema";

export const getUsersService = async ():Promise<TUserSelect[] | null>=> {     
    return await db.query.userTable.findMany();
}

export const getUserByIdService = async (user_id: number): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.user_id, user_id)
    })
}
export const getUserByEmailService = async (user_email: string): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.email, user_email)
    })
}

export const updateUserService = async (user_id: number, user: TUserInsert) => {
    await db.update(userTable).set(user).where(eq(userTable.user_id, user_id))
    return "User updated successfully 🎉";
}

export const deleteUserService = async (user_id: number) => {
    await db.delete(userTable).where(eq(userTable.user_id, user_id))
    return "User deleted successfully 🎉";
}


