
import { relations } from "drizzle-orm";
import { pgTable, pgEnum , serial,varchar, timestamp,integer, decimal, text } from "drizzle-orm/pg-core";

//roleEnum
export const roleEnum = pgEnum("role",['admin', 'user','disabled']);

//UserTable 1
export const userTable = pgTable( "userTable",{
        user_id: serial("user_id").primaryKey(),
        full_name: varchar("full_name"),
        email: varchar("email").notNull().unique().notNull(),
        password: varchar("password").notNull(),
        phone_number: varchar("phone_number"),
        address: varchar("address"),
        role: roleEnum('role').default('user'),
        created_at: timestamp("created_at").defaultNow(),
        updated_at: timestamp("updated_at").defaultNow(),
});

//Vehicle SPecification Table 2
export const vehicleSpecificationTable = pgTable( "vehicleSpecificationTable",{
  vehicleSpec_id: serial("vehicleSpec_id").primaryKey(),
  vehicle_name: varchar("vehicle_name"),
  vehicle_model: varchar("vehicle_model"),
  vehicle_year: varchar("vehicle_year"),
  fuel_type: varchar("fuel_type"),
  seating_capacity: integer("seating_capacity"),
  color: varchar("color"),
  engine_type: varchar("engine_type"),
  features: varchar("features"),
  vehicle_description: text("vehicle_description"),
  image1_url: varchar("image1_url"), 
  image2_url: varchar("image2_url"),
  image3_url: varchar("image3_url"), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//Vehicle Table 3
export const vehicleTable = pgTable( "vehicleTable",{
    vehicle_id: serial("vehicle_id").primaryKey(),
    vehicleSpec_id: integer("vehicleSpec_id").notNull().references(()=>vehicleSpecificationTable.vehicleSpec_id,{onDelete:"cascade"}),
    rental_rate: decimal("rental_rate"),
    availability: varchar("availability"),
     created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const statusEnum = pgEnum("status",['pending', 'approved','rejected']);

//Booking Table 4
export const bookingTable = pgTable( "bookingTable",{
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull().references(()=>userTable.user_id,{onDelete:"cascade"}),
    vehicle_id: integer("vehicle_id").notNull().references(()=>vehicleTable.vehicle_id,{onDelete:"cascade"}),
    booking_date: varchar("booking_date"),
    returning_date: varchar("returning_date"),
    total_amount: decimal("total_amount"),
    booking_status: statusEnum('booking_status').default('pending'),
    location: varchar("location"),
    checkout_status: varchar('checkout_status').default('pending'),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const paymentStatusEnum = pgEnum("payment_status",['pending', 'paid','failed']);

//Payment Table 5
export const paymentTable = pgTable( "paymentTable",{
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(()=>bookingTable.booking_id,{onDelete:"cascade"}),
    user_id: integer("user_id").notNull().references(()=>userTable.user_id,{onDelete:"cascade"}),
    payment_amount: decimal("payment_amount"),
    payment_status: paymentStatusEnum('payment_status').default('pending'),
    payment_mode: varchar("payment_mode"),
    session_id: varchar("session_id"),
    payment_date: timestamp("payment_date").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

//CustomerSupport Ticket Table 6
export const customerSupportTable = pgTable( "customerSupportTable",{
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(()=>userTable.user_id,{onDelete:"cascade"}),
    ticket_subject: varchar("ticket_subject"),
    ticket_description: varchar("ticket_description"),
    ticket_status: statusEnum('ticket_status').default('pending'),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

//Feedback Table 7
export const feedbackTable = pgTable( "feedbackTable",{
    feedback_id: serial("feedback_id").primaryKey(),
    user_id: integer("user_id").notNull().references(()=>userTable.user_id,{onDelete:"cascade"}),
    feedback_message: varchar("feedback_message"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

//Location and Branch Table 8
export const locationBranchTable = pgTable( "locationBranchTable",{
    branch_id: serial("branch_id").primaryKey(),
    location: varchar("location"),
    branch_name: varchar("branch_name"),
    branch_address: varchar("branch_address"),
    branch_contact: integer("branch_contact"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// export const fleetStatusEnum = pgEnum("fleetStatus",['pending', 'approved','rejected']);

//Fleet Management Table 9
export const fleetManagementTable = pgTable( "fleetManagementTable",{
    fleet_id: serial("fleet_id").primaryKey(),
    vehicle_id: integer("vehicle_id").notNull().references(()=>vehicleTable.vehicle_id,{onDelete:"cascade"}),
    acquisition_date: timestamp("acquisition_date"),
    depreciation_date: timestamp("depreciation_date"),
    current_value: decimal("current_value"),
    maintainance_cost: decimal("maintainance_cost"),
    status: statusEnum('status').default('pending'),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

//relationship
//relation between user(1) --> (n)booking and user(1) --> (n)feedback
export const user_booking_reltion = relations(userTable,({many})=>({
        feedbacks: many(feedbackTable),
        bookings: many(bookingTable),
        payments: many(paymentTable),
        support: many(customerSupportTable),
}))

//relation booking(1) --> (1)user and booking(1) --> (1)vehicle and booking(1) --> (1)location
export const booking_user_relation = relations(bookingTable,({one})=>({
        user: one(userTable,{
                fields:[bookingTable.user_id],
                references:[userTable.user_id]
        }),
        vehicle: one(vehicleTable,{
                fields:[bookingTable.vehicle_id],
                references:[vehicleTable.vehicle_id]
        }),
        location: one(locationBranchTable,{
                fields:[bookingTable.location],
                references:[locationBranchTable.branch_id]
        }),
        payment: one(paymentTable,{
                fields:[bookingTable.booking_id],
                references:[paymentTable.booking_id]
        }),

}))

//relation vehicle(1) --> (1)vehicleSpecification
export const vehicle_vehicleSpec_relation = relations(vehicleTable,({one})=>({
        vehicleSpec: one(vehicleSpecificationTable,{
                fields:[vehicleTable.vehicleSpec_id],
                references:[vehicleSpecificationTable.vehicleSpec_id]
        })

}))

//relation vehicleSpecification(1) --> (1)vehicle
export const vehiclesSpec_vehicle_relation = relations(vehicleSpecificationTable,({one})=>({
        vehicle: one(vehicleTable,{
                fields:[vehicleSpecificationTable.vehicleSpec_id],
                references:[vehicleTable.vehicleSpec_id]
        })
}))

//relation vehicleSpecification(1) --> (n)vehicle
export const vehicleSpec_vehicle_relation = relations(vehicleSpecificationTable,({many})=>({
        vehicles: many(vehicleTable)
}))

//relation payment(1) --> (1)booking
export const payment_booking_relation = relations(paymentTable,({one})=>({
        booking: one(bookingTable,{
                fields:[paymentTable.booking_id],
                references:[bookingTable.booking_id]
        })
}))

//infer types
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TVehicleSpecificationInsert = typeof vehicleSpecificationTable.$inferInsert;
export type TVehicleSpecificationSelect = typeof vehicleSpecificationTable.$inferSelect;

export type TVehicleInsert = typeof vehicleTable.$inferInsert;
export type TVehicleSelect = typeof vehicleTable.$inferSelect;

export type TBookingInsert = typeof bookingTable.$inferInsert;
export type TBookingSelect = typeof bookingTable.$inferSelect;

export type TPaymentInsert = typeof paymentTable.$inferInsert;
export type TPaymentSelect = typeof paymentTable.$inferSelect;

export type TCustomerSupportInsert = typeof customerSupportTable.$inferInsert;
export type TCustomerSupportSelect = typeof customerSupportTable.$inferSelect;

export type TFeedbackInsert = typeof feedbackTable.$inferInsert;
export type TFeedbackSelect = typeof feedbackTable.$inferSelect;

export type TLocationBranchInsert = typeof locationBranchTable.$inferInsert;
export type TLocationBranchSelect = typeof locationBranchTable.$inferSelect;

export type TFleetManagementInsert = typeof fleetManagementTable.$inferInsert;
export type TFleetManagementSelect = typeof fleetManagementTable.$inferSelect;

