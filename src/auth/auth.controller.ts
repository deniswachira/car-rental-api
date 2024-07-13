import "dotenv/config";
import { Context } from "hono";
import { loginUserService, registerUserService } from "./auth.service";
import bcrypt from 'bcrypt';
import { sign } from "hono/jwt";
import { getUserByEmailService, getUserByIdService } from "../users/user.service";

//register
export const createUser = async (c: Context) => {
    try {
        const user = await c.req.json();
        const user_email = user.email;
         const userExists = await getUserByEmailService(user_email);
        if (userExists) return c.json({msg: "Email already taken😒"}, 400);
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(user.password, salt);
        user.password = hashedPass;
        const newUser = await registerUserService(user);
        return c.json({msg: newUser}, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
//login
export const loginUser = async (c: Context) => {
   try {
     const user = await c.req.json();
     const user_email = user.email;

     // Check if user exists
     const userExists = await getUserByEmailService(user_email);
     if (!userExists) return c.json({msg: "User not found 😒"}, 400);

     // Check if password is correct
     const pass = user.password;
     const hashedPass = userExists?.password;
     const isMatch = bcrypt.compareSync(pass, hashedPass as string);
     if (!isMatch) {
         return c.json({msg: "Invalid Credential 😒"}, 400);
     } else {
         // Generate token
         let payload = {
             id: userExists.user_id,
             full_name: userExists.full_name,
             role: userExists.role,
             email: userExists.email,
             exp: Math.floor(Date.now() / 1000) + (60 * 180)
         };
         let secret = process.env.JWT_SECRET as string;  // Secret key
         const token = await sign(payload, secret);   // Create a JWT token

         // Remove password field
         const { password, ...userWithoutPassword } = userExists;

         // Return token and user details without password
         return c.json({ token, user: userWithoutPassword }, 200);
     }

   } catch (error: any) {
     return c.text(error?.message, 400);
   }
};