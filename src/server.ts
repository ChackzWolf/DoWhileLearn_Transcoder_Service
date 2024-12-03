import express, { Express, Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./Configs/MongoDB/DB";
import dotenv from "dotenv"
import * as fs from 'fs';
import * as grpc from "@grpc/grpc-js";
import path from "path";
import * as protoLoader from "@grpc/proto-loader";
import multer from "multer"



import { TranscodeController } from "./Controllers/Transcode.controller";
import { TranscodeInteractor } from "./Interactor/Transcode.interactor";
import { TranscodeRepository } from "./Repositories/Transcode.Repository";

const storage = multer.memoryStorage()
const upload = multer({storage})

const TranscoderRoute:Application = express()

dotenv.config();
connectDB()

const app: Express = express();
const port = process.env.PORT || 5010;

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// app.use("/transcode", TranscoderRoute);


// app.post("/convert", async (req, res) => {
//   // Your video conversion logic here...
// });

const repository = new TranscodeRepository()
const interactor = new TranscodeInteractor(repository)
const controller = new TranscodeController(interactor)
                        
// TranscoderRoute.post("/",upload.single("file"),controller.transcodeData.bind(controller))
// TranscoderRoute.get("/videoURL",controller.getData.bind(controller))

const packatgeDefinition = protoLoader.loadSync(
  path.join(__dirname, "/Protos/transcoder.proto"), 
  {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true}
)

const transcoderProto = grpc.loadPackageDefinition(packatgeDefinition)as any;

const server =  new grpc.Server({
    'grpc.max_receive_message_length': 1 * 1024 * 1024 * 1024 // 1 GB
})

const grpcServer = () => {
    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port) => {
            if(err){
                console.log(err, "Error happened grpc transcoder service.");
                return;
            }else{
                console.log("TRANSCODER_SERVICE running on port: ", port);
            }
        } 
    )
}
grpcServer()

server.addService(transcoderProto.TranscoderService.service, {
  UploadFile: controller.transcodeData,
})

