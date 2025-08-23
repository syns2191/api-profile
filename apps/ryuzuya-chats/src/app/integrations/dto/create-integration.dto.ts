import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateIntegrationDto {
  @IsOptional()
  @IsString()
  channel: string;

  @IsOptional()
  @IsObject()
  creds: {};

  @IsOptional()
  @IsString()
  user: string;
}
