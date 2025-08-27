import { BadRequestException, Body, Controller, Get, Inject, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { createHash } from 'crypto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
    @Body('key') key?: string,
    @Body('acl') acl?: 'public-read' | 'private'
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    if (file.size > (10 * 1024 * 1024)) {
      throw new BadRequestException('File max 10 MB');
    }
    const contentType = file.mimetype || 'application/octet-stream';

    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const hash = createHash('sha1').update(file.buffer).digest('hex').slice(0,12);
    const finalKey = key ?? `upload/${new Date().toISOString().slice(0,10)}/${hash}.${ext || 'bin'}`;
    return this.uploadService.uploadStream(finalKey, file.buffer, contentType, acl);
  }
}
