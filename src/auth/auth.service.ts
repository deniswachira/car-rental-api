
import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import {TUserInsert,TUserSelect, userTable  } from "../drizzle/schema";
type TRIUser = Array<{ id: number }>;


export const registerUserService = async (user: TUserInsert): Promise<TRIUser | undefined> => {
    return await db.insert(userTable).values(user).returning({id:userTable.user_id}).execute();
}

export const loginUserService = async(user:TUserSelect) => {
    const {email,password} = user;
    return await db.query.userTable.findFirst({
        columns: {
            email: true,
            role: true,
            password: true,
            user_id:true,
            full_name:true,
            phone_number:true,
        }, where : sql `${userTable.email} = ${email}`,
        
    })
}
