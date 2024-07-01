
import { pgTable, pgEnum , serial,varchar, timestamp,integer } from "drizzle-orm/pg-core";

//roleEnum
export const roleEnum = pgEnum("role",['admin', 'user','both']);

//UserTable 1
export const userTable = pgTable( "userTable",{
        user_id: serial("user_id").primaryKey(),
        full_name: varchar("full_name"),
        email: varchar("email").notNull().unique().notNull(),
        password: varchar("password").notNull(),
        phone_number: integer("phone_number"),
        address: varchar("address"),
        role: roleEnum('role').default('user'),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
});






//infer types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;