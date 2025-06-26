import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponse } from './dto/upload-response';

interface UploadObjectResponse {
  ServerSideEncryption: string;
  Location: string;
  Bucket: string;
  Key: string;
  ETag: string;
}

@Injectable()
export class UploadService {
  async uploadToS3(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResponse> {
    const bucketS3 = process.env.AWS_BUCKET_NAME;

    if (!folder) folder = '/';
    if (!folder.startsWith('/'))
      throw new BadRequestException(`Folder should starts with /`);

    const uploadInfo: UploadObjectResponse = (await this.uploadFileToS3(
      file.buffer,
      `${bucketS3}${folder}`,
      `${uuidv4()}.${file.originalname.split('.').pop().toLowerCase()}`,
    )) as UploadObjectResponse;

    return {
      url: uploadInfo.Location,
    };
  }

  async uploadFileToS3(file: string | Buffer, bucket: string, name: string) {
    const s3 = this.getS3();

    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: name.slice(-4) === '.png' ? 'image/png' : 'image/jpeg',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async deleteFileFromS3(fileURL: string) {
    const s3 = this.getS3();
    const objectURL = new URL(fileURL);
    const getObjectKey = fileURL.replace(`${objectURL.origin}/`, '');

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: getObjectKey,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
