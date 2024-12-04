import { Transcoder } from "../Entities/Transcoder";

export interface ITranscodeInteractor {
    addFileDetails(fileName: string, instructorId: string): Promise<any>
    transcodeMedia(file: File, id: string, progressCallback: (progress: number, message: string) => void):Promise<any>;
    getData(id: string): Promise<Transcoder | any>;
} 