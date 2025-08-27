import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(
    @Inject('S3_CLIENT')
    private readonly s3: S3Client,
    private readonly config: ConfigService
  ) {}

  async presignPut(key: string, contentType: string, acl: string) {
    const Bucket = this.config.get<string>('S3_BUCKET');
    const s3ForcePathStyle = this.config.get<string>('S3_FORCE_PATH_STYLE');
    const s3Endpoint = this.config.get<string>('S3_ENDPOINT');
    const cmd = new PutObjectCommand({
      Bucket,
      Key: key,
      ContentType: contentType,
      ACL: acl as any
    });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 600 });

    const publicUrl = s3ForcePathStyle === 'true' ? `${s3Endpoint.replace(/\/+$/, '')}/${Bucket}/${encodeURIComponent(key)}`
      :  `https://${Bucket}.${new URL(s3Endpoint).host}/${encodeURIComponent(key)}`;

    return {
      url,
      key,
      bucket: Bucket,
      publicUrl
    }
  }

  async uploadStream(key: string, body: Buffer | Readable, contentType?: string, acl?: 'public-read' | 'private') {
    const Bucket = this.config.get<string>('S3_BUCKET');
    const s3ForcePathStyle = this.config.get<string>('S3_FORCE_PATH_STYLE');
    const s3Endpoint = this.config.get<string>('S3_ENDPOINT');

    const uploader = new Upload({
      client: this.s3,
      params: {
        Bucket,
        Key: key,
        Body: body,
        ...(contentType ? { ContentType: contentType } : {}),
        ...(acl ? { ACL: acl } : {})
      },
      queueSize: 4,
      partSize: 8 * 1024 * 1024,
      leavePartsOnError: false
    });
    await uploader.done();
    const endPointHost = new URL(s3Endpoint).host;
    let publicUrl: string;
    if (s3ForcePathStyle === 'true') {
      publicUrl = `${s3Endpoint.replace(/\/+$/, '')}/${Bucket}/${encodeURIComponent(key)}`;
    } else {
      publicUrl = `https://${Bucket}.${endPointHost}/${encodeURIComponent(key)}`
    }
    return {
      ok: true,
      bucket: Bucket,
      key,
      publicUrl
    }
  }
}
