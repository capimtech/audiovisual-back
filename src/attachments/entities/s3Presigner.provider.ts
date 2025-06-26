import * as S3Presigner from '@aws-sdk/s3-request-presigner';
import { ValueProvider } from '@nestjs/common';

export type S3PresignerType = typeof S3Presigner;
export const S3PresignerKey = '@aws-sdk/s3-request-presigner';

const S3PresignerProvider: ValueProvider<S3PresignerType> = {
  provide: S3PresignerKey,
  useValue: S3Presigner,
};

export { S3PresignerProvider };
