import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { FactoryProvider } from '@nestjs/common';

const S3ClientProvider: FactoryProvider<S3Client> = {
  provide: S3Client,
  useFactory: () => {
    const s3Options: S3ClientConfig = {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    return new S3Client(s3Options);
  },
};

export { S3ClientProvider };
