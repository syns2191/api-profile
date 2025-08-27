import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (config: ConfigService) =>
        new S3Client({
          region: config.get<string>('S3_REGION'),
          endpoint: config.get<string>('S3_ENDPOINT'),
          forcePathStyle: config.get<string>('S3_FORCE_PATH_STYLE') === 'true',
          credentials: {
            accessKeyId: config.get<string>('S3_ACCESS_KEY'),
            secretAccessKey: config.get<string>('S3_SECRET_KEY')
          }
        }),
      inject: [ConfigService]
    },
  ],
  exports: ['S3_CLIENT']
})
export class S3Module {}
