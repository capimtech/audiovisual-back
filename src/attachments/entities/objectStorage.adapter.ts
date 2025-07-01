import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';
import { S3PresignerKey, S3PresignerType } from './s3Presigner.provider';
export type CannedACL = 'private' | 'public-read';

@Injectable()
export class ObjectStorageAdapter {
  constructor(
    @Inject(S3Client) private s3Client: S3Client,
    @Inject(STSClient) private readonly stsClient: STSClient,
    @Inject(S3PresignerKey)
    private readonly requestPresigner: S3PresignerType,
  ) {}

  async generatePresignedPutUrl(
    key: string,
    expiresIn = 48 * 3600,
    acl: CannedACL = 'public-read',
    contentType = 'application/octet-stream',
  ): Promise<string> {
    if (acl) true;

    const stsCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ROLE_ARN,
      RoleSessionName: 'signed-url-session',
      DurationSeconds: 3600,
    });

    const { Credentials } = await this.stsClient.send(stsCommand);

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      StorageClass: 'INTELLIGENT_TIERING',
      // ACL: acl, // This is not supported by the current bucket policy
      ContentType: contentType,
      Metadata: {
        'Content-Type': contentType,
      },
    });
    return this.requestPresigner.getSignedUrl(this.s3Client, command, {
      expiresIn,
    });
  }

  async generatePresignedGetUrl(
    key: string,
    expiresIn = 7 * 24 * 3600,
    contentType?: string,
  ): Promise<string> {
    const stsCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ROLE_ARN,
      RoleSessionName: 'signed-url-session',
      DurationSeconds: 3600,
    });

    const { Credentials } = await this.stsClient.send(stsCommand);

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: Credentials?.AccessKeyId,
        secretAccessKey: Credentials?.SecretAccessKey,
        sessionToken: Credentials?.SessionToken,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ResponseContentType: contentType,
    });

    return this.requestPresigner.getSignedUrl(this.s3Client, command, {
      expiresIn,
    });
  }

  async uploadReadableStream(
    key: string,
    readable: Readable,
    contentType?: string,
  ): Promise<void> {
    const stsCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ROLE_ARN,
      RoleSessionName: 'signed-url-session',
      DurationSeconds: 3600,
    });

    const { Credentials } = await this.stsClient.send(stsCommand);

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: Credentials?.AccessKeyId,
        secretAccessKey: Credentials?.SecretAccessKey,
        sessionToken: Credentials?.SessionToken,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: readable,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }

  async uploadBuffer(
    key: string,
    buffer: Buffer,
    contentType = 'application/octet-stream',
  ): Promise<void> {
    const stsCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ROLE_ARN,
      RoleSessionName: 'signed-url-session',
      DurationSeconds: 3600,
    });

    const { Credentials } = await this.stsClient.send(stsCommand);

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: Credentials?.AccessKeyId,
        secretAccessKey: Credentials?.SecretAccessKey,
        sessionToken: Credentials?.SessionToken,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        'Content-Type': contentType,
      },
    });
    await this.s3Client.send(command);
  }

  async deleteObject(key: string): Promise<void> {
    const stsCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ROLE_ARN,
      RoleSessionName: 'signed-url-session',
      DurationSeconds: 3600,
    });

    const { Credentials } = await this.stsClient.send(stsCommand);

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: Credentials?.AccessKeyId,
        secretAccessKey: Credentials?.SecretAccessKey,
        sessionToken: Credentials?.SessionToken,
      },
    });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await this.s3Client.send(deleteCommand);
  }
}
