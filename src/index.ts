import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prometheus } from '@hono/prometheus'
import { limiter } from './middleWare/rateLimiter';
import { readFile } from 'fs/promises';
import "dotenv/config"

const app = new Hono();
const {printMetrics, registerMetrics} = prometheus();

//3rd party middleware
app.use('*', registerMetrics) //prometheus to monitor metrics
app.use(limiter); //rate limiter

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


console.log("Server is running on port " + process.env.PORT)

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000)
})
