import { Status, Transcoder } from "../Entities/Transcoder";
import { ITranscodeInteractor } from "../Interface/ITranscode.Interactor";
import { ITranscodeRepository } from "../Interface/ITranscode.Repository";
import { FFmpegTranscoder } from "../Utils/ffmpeg";
import { s3 } from "../Configs/S3/S3Config";
import { S3Params } from "../Interface/Custom";
import fs from "fs";
import {  PutObjectCommand } from "@aws-sdk/client-s3";
import { rimraf } from "rimraf";
import { configs } from "../Configs/Env_configs/ENV.configs";
// import { convertToWav } from "../utils/convert-to-wav";
// import { transcriberNode } from "../utils/node-whisper";
// import {statusCode} from "asif-status-codes-package"

export class TranscodeInteractor implements ITranscodeInteractor {
  private repository: ITranscodeRepository;

  constructor(repository: ITranscodeRepository) {
    this.repository = repository;
  }

  async addFileDetails(fileName: string, instructorId: string): Promise<any> {
    try {
      const response = await this.repository.addFileDetails(fileName, instructorId );
      return response;
    } catch (e: any) {
      console.log(e);
    }
  }

  async transcodeMedia(file: File, id: string, progressCallback: (progress: number, message: string) => void) : Promise<any>{
    try {
      console.log('troancodeMedia')
      console.log('file: ', file, "Id:" , id);
      const { filePath, fileName, outputDirectoryPath, directoryPath , status} =  await FFmpegTranscoder(file,progressCallback);
      if(outputDirectoryPath===false){
        
        const status = 503
        return status
      }
      
      await this.repository.updateStatus(id, Status.subtitle, {
        generatedName: fileName,
      });

      // const wavFilePath = await convertToWav(filePath);
      // await transcriberNode(fileName);
      // const vttFilePath = `${wavFilePath}.vtt`;
      // console.log(vttFilePath,"--------------------")
      await this.repository.updateStatus(id, Status.finishing, {});
      progressCallback(70, 'processing...')

      const files = fs.readdirSync(outputDirectoryPath);
      console.log('files: ', files, 'files')


      const progressADD = 25/files.length
      console.log(files.length, 'files length');
      console.log(progressADD, 'progress to add');
      let currentProgress  = 70
      for (const file of files) {
        console.log(file, 'filename loop started')
        const filePaths = `${outputDirectoryPath}/${file}`;
        const fileStream = fs.createReadStream(filePaths);

        console.log(filePath, 'filePath');
        currentProgress += progressADD
        progressCallback(currentProgress, 'uploading..')
        

        const params: S3Params = {
          Bucket: process.env.BUCKET_NAME || "",
          Key: `${fileName}/${file}`,
          Body: fileStream,
          ContentType: file.endsWith(".ts") ? "video/mp2t" : file.endsWith(".m3u8") ? "application/x-mpegURL" : null,
        };
        try {
          const command = new PutObjectCommand(params);
          const rslt = await s3.send(command);
          
          // fs.unlinkSync(filePaths);
        } catch (err) {
          throw new Error(`s3 error ${err}`);
        }
      }

      // const vttFileBuffer = fs.readFileSync(`${vttFilePath}`);
      // const params: S3Params = {
      //   Bucket: process.env.BUCKET_NAME || "",
      //   Key: `media/vtt/${fileName}.vtt`,
      //   Body: vttFileBuffer,
      //   ContentType: "text/vtt",
      // };
      // try {
      //   const command = new PutObjectCommand(params);
      //   const rslt = await s3.send(command);
      //   console.log(`Uploaded vtt to S3`);
      // } catch (err) {
      //   throw new Error("error while uploading vtt into s3")
      // }

      console.log(`Deleting locally saved files`);
      rimraf.sync(outputDirectoryPath);
      // fs.unlinkSync(wavFilePath);
      // fs.unlinkSync(vttFilePath);
      console.log('unlinking sync');
      fs.unlinkSync(filePath);
      console.log(`Deleted locally saved files`);

      const videoUrl = `https://${configs.BUCKET_NAME}.s3.${configs.AWS_REGION}.amazonaws.com/${fileName}/${fileName}_master.m3u8`;
      // const subtitleUrl = `https://transcode-genius.s3.ap-south-1.amazonaws.com/media/vtt/${fileName}.vtt`
      //  const subtitleUrl = `https://transcode-genius.s3.ap-south-1.amazonaws.com/media/vtt/.vtt`
    
      return await this.repository.updateStatus(id, Status.completed, { videoUrl });

    } catch (e: any) {
      await this.repository.updateStatus(id, Status.error, {});
      console.log(e);
      return false
    }
  }


  
  async getData(id: string): Promise<Transcoder | any> {
    try {
      const response = await this.repository.getData(id);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  }



}