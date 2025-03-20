import express from "express";
import logger from "./utils/logger";
import { entityRouter } from "./routes/entity.routes";
import cors from "cors";
import webpush from "web-push";
import { userRouter } from "./routes/user.routes";
import { roleAccessRouter } from "./routes/role.routes";
import { authMiddleware } from "./middlewares/auth.middlewares";
import { pageRouter } from "./routes/page.routes";
import { branchRouter } from "./routes/branch.routes";
import {additionfeatureRouter} from './routes/additionalfeature.routes'
import { designationRouter } from "./routes/designation.routes";
import {countryRouter} from './routes/country.routes'
import {stateRouter} from './routes/state.routes'
import {cityRouter} from './routes/cities.routes'
import {bankRouter} from './routes/bank.routes'
import {pincodeRouter} from './routes/pincode.routes'
import {vendorRouter} from './routes/vendor.routes'

import pdfRouter from "./routes/pdf.routes";
import dotenv from 'dotenv';
import {errorHandler} from './middlewares/error.middlewares'
import helmet from "helmet";
import fs from 'fs'

import {typesRouter} from './routes/types.routes'
import {readinglogRouter} from './routes/readinglog.routes'
import {notificationRouter}  from './routes/notification.routes';
import {eventRouter}  from './routes/event.routes';

// =========Socket code =============//
import  { createServer } from "http"; // Import HTTP module
import { Server } from "socket.io";


const environment = process.env.NODE_ENV || 'development';
if (environment === 'production') {
    dotenv.config({ path: '/root/.global_env' });
} else {
    if (fs.existsSync('.env')) {
        dotenv.config();
    } else {
        console.error('Local .env file not found');
    }
}

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
    cors({
        origin: '*',
    })
);

app.use((req, _res, next) => {
  logger.info(
    `${req.method} ${req.path}\n ${JSON.stringify(
      req.query
    )}\n ${JSON.stringify(req.body)}`
  );
  next();
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
      origin: "*",
      methods:["GET","POST"]
  }
});
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id)

 //===========JOING THE ROOM==============// HITING FROM FRONTEND catch the entity and join with room
  socket.on("joinEntityRoom", (entity_id) => {
      socket.join(`entity_${entity_id}`);
      console.log(`Client ${socket.id} joined room entity_${entity_id}`);
  });

  socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
  });
});
export { io }; 
app.set("io", io); //it will set in req ,so we can use it as req.app.get('io')

export const webPush = webpush.setVapidDetails(
  "mailto:teamarisecraft@gmail.com",
  process.env.WMS_VAPID_PUBLIC_KEY || '',
  process.env.WMS_VAPID_PRIVATE_KEY || ''
);

app.get("/", async (_req, res) => {
  res.send('Welcome to WMS server 😀')
});

// app.use('/file' , fileRouter);
app.use("/user", userRouter);
app.use("/pdf", pdfRouter);
app.use("/event", eventRouter);

app.use(authMiddleware); 

app.use("/entity", entityRouter);
app.use("/role", roleAccessRouter);
app.use("/page", pageRouter);
app.use('/additionalfeature',additionfeatureRouter)
app.use("/branch", branchRouter);
app.use("/designation", designationRouter);
app.use('/country',countryRouter);
app.use('/state',stateRouter);
app.use('/city',cityRouter);
app.use('/bank',bankRouter);
app.use('/pincode',pincodeRouter);

app.use('/vendor',vendorRouter);
app.use('/types',typesRouter);
app.use('/readinglog',readinglogRouter);
app.use('/notification', notificationRouter);

app.use(errorHandler);
//use httpserver instaed app.listen
httpServer.listen(5009, () => {
  logger.info(`Server Started on port 5009`);
});

export default app;