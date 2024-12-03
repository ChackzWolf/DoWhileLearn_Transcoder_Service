"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
require("dotenv/config");
const bucketRegion = process.env.S3_BUCKET_REGION || "";
const accessKey = process.env.ACCESS_KEY_ID || "";
const secretkey = process.env.SECRET_ACCESS_KEY || "";
exports.s3 = new client_s3_1.S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretkey
    }
});
