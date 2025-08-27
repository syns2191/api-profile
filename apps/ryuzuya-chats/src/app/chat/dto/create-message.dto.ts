import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
export class CreateMessageDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  conversationId: string;

  @IsOptional()
  @IsString()
  guestId: string;

  @IsOptional()
  @IsString()
  profileId: string;

  @IsOptional()
  @IsBoolean()
  read: boolean;

  @IsOptional()
  @IsString()
  to: string;

  @IsOptional()
  @IsString()
  sender: string;

  @IsOptional()
  @IsObject()
  extraContent: object
}
