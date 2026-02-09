import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';

import connectCloudinary from './config/cloudinary.js';
import donorRouter from './routes/donorRoute.js'
import ngoRouter from './routes/ngoRoute.js';
import volunteerRouter from './routes/volunteerRoute.js';
import chatBoatRouter from './chatboat/chatBoatRouter.js';
import adminRouter from './routes/adminRoute.js';
import { getImpactOverview, getImpactStats } from "./controllers/publicController.js";
import { loginAdmin, stats, listAllDonations, deleteDonation } from './controllers/adminController.js';
import authAdmin from './middlewares/authAdmin.js';
import Certificaterouter from './routes/certificateRoutes.js';

// app config
const app=express();
const port=process.env.PORT || 4000
await connectDB();


connectCloudinary(); //cloudinary connect hora hai 



//middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  // console.log("REQ", req.method, req.url);
  next();
})

app.use('/api/donor' , donorRouter)
app.use('/api/ngo',ngoRouter)
app.use('/api/volunteer',volunteerRouter)
app.get("/api/public/impact-stats", getImpactStats)
app.get("/api/public/impact-overview", getImpactOverview)
app.use('/api/admin', (req,res,next)=>{ console.log('admin route hit', req.method, req.url); next(); }, adminRouter)

app.post('/api/admin/login', loginAdmin)
app.get('/api/admin/login', (req, res) => res.send('admin login GET test'))
app.get('/api/admin/stats', authAdmin, stats)
app.get('/api/admin/donations', authAdmin, listAllDonations)
app.delete('/api/admin/donations/:id', authAdmin, deleteDonation)
try {
  const listRoutes = (app) => {
    const routes = [];
    const stack = app._router?.stack || app.router?.stack || [];
    stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(",").toUpperCase();
        routes.push(`${methods} ${middleware.route.path}`);
      } else if (middleware.name === "router" && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const methods = Object.keys(route.methods).join(",").toUpperCase();
            routes.push(`${methods} ${middleware.regexp} -> ${route.path}`);
          }
        });
      }
    });
 
    return routes;
  };
  listRoutes(app);
} catch (e) {
  console.log("Route listing failed:", e.message);
}

app.get('/api/_debug/routes', (req, res) => {
  try {
    const stack = app._router?.stack || app.router?.stack || [];
    const routes = [];
    stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(",").toUpperCase();
        routes.push({ methods, path: middleware.route.path });
      } else if (middleware.name === "router" && middleware.handle?.stack) {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const methods = Object.keys(route.methods).join(",").toUpperCase();
            routes.push({ methods, path: route.path });
          }
        });
      }
    });
    res.status(200).json({ success: true, count: routes.length, routes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
})



app.use("/api/chatbot", chatBoatRouter);

app.use("/api/certificates",Certificaterouter)


app.get('/',(req,res)=>{
     res.send("Api working " )
})

app.get('/admin-test', (req,res)=> res.send('admin test ok'))
app.get('/api/admin', (req,res)=> res.send('admin base ok'))
app.use((req, res, next) => {
 
  next();
})

app.listen(port,()=>{
  
  console.log('server is started on ', port);
    
})
