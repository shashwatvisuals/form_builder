import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js"
import dotenv from 'dotenv';
import userRouter from "./routes/userRoute.js"
import fileRoutes from './routes/fileRoute.js';
import protectedRouter from "./routes/protectedroute.js";


const allowedOrigins = ['http://localhost:5173'];

// //app config
const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

dotenv.config();
//DB connection
connectDB();


//api endpoints

app.use("/api/user", userRouter)
app.use('/api/files', fileRoutes);
app.use("/api/protected", protectedRouter);





app.listen(port,() => {
    console.log(`server started on http://localhost:${port}`)
})