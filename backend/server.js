import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js"
import dotenv from 'dotenv';
import userRouter from "./routes/userRoute.js"
import fileRoutes from './routes/fileRoute.js';
import protectedRouter from "./routes/protectedroute.js";
import formRouter from "./routes/formRoute.js";
import statsRoutes from "./routes/statsRoutes.js"

const allowedOrigins = ['https://form-builder-frontend-6o3j.onrender.com'];

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
app.use("/api/forms", formRouter);
app.use('/api/stats', statsRoutes);




app.listen(port,() => {
    console.log(`server started on http://localhost:${port}`)
})