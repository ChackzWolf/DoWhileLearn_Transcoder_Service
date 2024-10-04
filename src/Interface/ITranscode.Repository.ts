import { Status, Transcoder } from "../Entities/Transcoder";

export interface ITranscodeRepository {

    addFileDetails(fileName: string, instructorId: string): Promise<Object | null>;
    updateStatus(id:string, status:Status, {subtitleUrl, videoUrl, generatedName}: Data):Promise<Transcoder | null>;
    getData(id:string):Promise<Transcoder | null>;
}

export interface Data {
    generatedName?: string;
    subtitleUrl?:string;
    videoUrl?:string;
  }