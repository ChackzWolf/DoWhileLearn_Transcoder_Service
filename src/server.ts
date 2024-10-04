import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import TranscoderRoute from "./Routes/Route";
import { connectDB } from "./Configs/MongoDB/DB";
import dotenv from "dotenv"
import * as fs from 'fs';


dotenv.config();
connectDB()

const app: Express = express();
const port = process.env.PORT || 5009;

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/transcode", TranscoderRoute);


app.post("/convert", async (req, res) => {
  // Your video conversion logic here...
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});