import { serve } from '@hono/node-server'
import { Context, Hono, HonoRequest } from 'hono'
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
import { fleetMgntRouter } from './fleet/fleet.mgnt.router';
import { branchRouter } from './location/location.router';
import { paymentRouter } from './payment/payment.router';
import { vehicleRouter } from './vehicle/vehicle.router';
import { vehicleSpecsRouter } from './vehicleSpec/vehicleSpecs.router';
import dotenv from 'dotenv';
import handleStripeWebhook from './payment/payment.controller';
import { ticketRouter } from './tickets/ticket.router';
import { logRouter } from './utils/utils.router';
dotenv.config();


const app = new Hono();
const {printMetrics, registerMetrics} = prometheus();
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('*', registerMetrics) //prometheus to monitor metrics
app.use(cors()) 
app.use(limiter); //rate limiter

//webhooks
app.post('/webhook', handleStripeWebhook)

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
app.route("/", logRouter )
  



assert(process.env.PORT, "PORT is not set in the .env file")
console.log("Server is running on port  " + process.env.PORT + " 📢 📢")

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000)
})
