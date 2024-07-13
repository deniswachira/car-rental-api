import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { prometheus } from '@hono/prometheus'
import { limiter } from './middleWare/rateLimiter';
import { readFile } from 'fs/promises';
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import {cors} from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash'
import  assert from 'assert' 
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/user.router';
import { bookingRouter } from './booking/booking.router';
import { ticketRouter } from './customerSupport/customerSupport.router';
import { fleetMgntRouter } from './fleet/fleet.mgnt.router';
import { branchRouter } from './location/location.router';
import { paymentRouter } from './payment/payment.router';
import { vehicleRouter } from './vehicle/vehicle.router';
import { vehicleSpecsRouter } from './vehicleSpec/vehicleSpecs.router';
import stripeLib from 'stripe';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import db from './drizzle/db';
import { paymentTable } from './drizzle/schema';
import { Placeholder, SQL } from 'drizzle-orm';
dotenv.config();

const app = new Hono();
const {printMetrics, registerMetrics} = prometheus();
// const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' })
// app.use(bodyParser.json());
//3rd party middleware
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('*', registerMetrics) //prometheus to monitor metrics
app.use(cors()) 
app.use(limiter); //rate limiter

// Middleware to parse raw body for webhook verification
// app.use('/webhook', bodyParser.raw({ type: 'application/json', limit: '1mb' }));

// app.post('/webhook', async (c: Context) => {
//   const sig = c.req.header('stripe-signature');
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(await c.req.json(), sig || '', 'your_stripe_webhook_secret');
//   } catch (err) {
//     console.error(`⚠️  Webhook signature verification failed.`, (err as Error).message);
//     return c.text(`Webhook Error: ${err}`, 400);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;

//     // Create a payment record in your database
//     await createPaymentRecord(session);
//   }

//   return c.json({ received: true });
// });

async function createPaymentRecord(session: stripeLib.Checkout.Session) {
  const payment = {
    booking_id: Number(session.metadata?.booking_id),
    amount: session.amount_total,
    payment_status: session.payment_status as "paid" | SQL<unknown> | "pending" | "failed" | Placeholder<string, any> | null | undefined,
    payment_mode: session.payment_method_types[0]
  };

  await db.insert(paymentTable).values(payment)
  return "Payment inserted successfully 🎉";
}

//default routes
app.get('/', async (c) => {
    try {
        let html = await readFile('./index.html', 'utf-8');
        return c.html(html);
    } catch (err:any) {
        return c.text(err.message, 500);
    }
});

app.notFound((c) => {
  return c.text('Route Not Found', 404)
})
app.get('/metrics', printMetrics)

//custom routes
app.route("/", authRouter)  
app.route("/", userRouter)  
app.route("/", bookingRouter)  
app.route("/", ticketRouter)  
app.route("/", fleetMgntRouter)
app.route("/", branchRouter )
app.route("/", paymentRouter )
app.route("/", vehicleRouter )
app.route("/", vehicleSpecsRouter )
  



assert(process.env.PORT, "PORT is not set in the .env file")
console.log("Server is running on port  " + process.env.PORT + " 📢 📢")

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000)
})
