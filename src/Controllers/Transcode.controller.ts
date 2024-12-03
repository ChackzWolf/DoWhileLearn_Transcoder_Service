import { ITranscodeInteractor } from "../Interface/ITranscode.Interactor";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../Interface/Custom";
import { statusCode } from "asif-status-codes-package";
import * as grpc from '@grpc/grpc-js'; 

export class TranscodeController {
  private interactor: ITranscodeInteractor;

  constructor(interactor: ITranscodeInteractor) {
    this.interactor = interactor;
  }


  // instructorData
  // file
  transcodeData = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> =>{
    try { 
      console.log(call.request, 'reached here')
      // const instructorData = call.request 

      // const instructorData = call.request.tutorId;

      const fileBuffer: any = call.request.file;

      // const decoded: any = jwt.verify(
      //   instructorData,
      //   process.env.JWT_SECRET || "" 
      // );
      // const instructorId = decoded.instructorId;

      const instructorId = call.request.tutorId
      const originalname = call.request.originalname
      const response: any = await this.interactor.addFileDetails( originalname, instructorId );

      const status = await this.interactor.transcodeMedia( fileBuffer, response?._id );
      console.log('status: from controller', status);
      
      if (status.status === "Uploaded") {
        callback(null,{ status: true });
      } else if (status === 503) {
        callback(null,{ status: false });
      } else {
        callback(null,{ status: false });
      }
    } catch (err) {}
  };

  getData = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const instructorData = req.cookies.instructorData;
      const decoded: any = jwt.verify(
        instructorData,
        process.env.JWT_SECRET || ""
      );
      const instructorId = decoded.instructorId;
      const response = await this.interactor.getData(instructorId);
      res.status(statusCode.Accepted).json(response);
    } catch (e: any) {
      next(e);
    }
  };
}