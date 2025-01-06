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


    transcodeData = async (call: grpc.ServerWritableStream<any, any>): Promise<void> => {
        try {
            console.log(call.request, 'reached here')

            const fileBuffer: any = call.request.file;
            const instructorId = call.request.tutorId
            const originalname = call.request.originalname

            const progressCallback = (progress: number, message: string) => {
                // Send progress updates to the client
                call.write({
                    status: "Processing",
                    message,
                    progress,
                });
            };

            const response: any = await this.interactor.addFileDetails(originalname, instructorId);



            const status = await this.interactor.transcodeMedia(fileBuffer, response?._id, progressCallback);
            console.log('status: from controller', status.videoUrl);

            if (status.status === "Uploaded") {
                call.write({
                    status: "Completed",
                    message: "File uploaded and transcoded successfully",
                    progress: 100,
                    videoURL: status.videoUrl
                });
                // callback(null,{ status: true });
            } else if (status === 503) {
                call.write({
                    status: "Error",
                    message: "Transcoding service unavailable",
                    progress: 0,
                });
                // callback(null,{ status: false });
            } else {
                call.write({
                    status: "Error",
                    message: "An unknown error occurred",
                    progress: 0,
                });
                // callback(null,{ status: false });
            }
        } catch (err) {
            console.error("Error in transcodeData:", err);
            call.write({
                status: "Error",
                message: "An error occurred during the process",
                progress: 0,
            });
        } finally {
            call.end()
        }
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