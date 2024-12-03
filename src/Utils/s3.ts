import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import { configs } from "../Configs/Env_configs/ENV.configs";


dotenv.config();
const bucketName = configs.BUCKET_NAME
const region = configs.AWS_REGION

const s3Client = new S3Client({ region: 'eu-north-1' });

export const uploadFile = async (videoBinary: any) => {

  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-video.mp4`, // Unique file name
    Body: videoBinary,         // Video file buffer from gRPC request
    ContentType: 'video/mp4',       // Optional, set the content type
};
  try {
    // Upload the file (without ACL, since bucket does not allow ACLs)
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('File uploaded successfully:', params.Key);

    // Return the public URL of the uploaded file
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${params.Key}`;
    console.log('Public URL:', publicUrl);

    return { publicUrl }; // Return the public URL for future use
  } catch (err: any) {
    throw new Error(`Failed to upload file: ${err.message}`);
  }
}; 

export const uploadImage = async (imageBinary: Buffer, imageName: string) => {
  // Determine the content type based on the file extension
  const contentType = imageName.endsWith('.png') ? 'image/png' :
                      imageName.endsWith('.jpg') || imageName.endsWith('.jpeg') ? 'image/jpeg' :
                      'image/jpeg'; // default content type

  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-${imageName}`, // Unique file name
    Body: imageBinary,                // Image file buffer from gRPC request
    ContentType: contentType,         // Set the correct content type for the image
  };

  

  try {
    // Upload the file
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('File uploaded successfully:', params.Key);

    // Return the public URL of the uploaded file
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${params.Key}`;
    console.log('Public URL:', publicUrl);
    return { publicUrl }; // Return the public URL for future use
  } catch (err: any) {
    console.error('Upload error:', err);
    throw new Error(`Failed to upload file: ${err.message}`);
  }
};

