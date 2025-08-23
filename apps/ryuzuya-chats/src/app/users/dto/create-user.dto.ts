import {
  IsString,
  IsArray,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsOptional
} from 'class-validator';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly displayName: string;
  @IsOptional()
  @IsEmail()
  readonly email: string;
  @IsOptional()
  @IsUrl()
  readonly linkedind: string;
  @IsOptional()
  @IsUrl()
  readonly github: string;
  @IsOptional()
  @IsUrl()
  readonly x: string;
  @IsOptional()
  @IsString()
  readonly avatar: string;
  @IsOptional()
  @IsString()
  readonly githubUsername: string;
  @IsOptional()
  @IsBoolean()
  readonly isOwner: boolean;
  @IsOptional()
  @IsString()
  readonly profileBranding: string;
  @IsOptional()
  @IsString()
  readonly profileDescription: string;
  @IsOptional()
  @IsString()
  readonly profileCoverText: string;
  @IsOptional()
  @IsArray()
  readonly skills: [];
  @IsOptional()
  @IsString()
  @IsOptional()
  readonly password: string;
  @IsString()
  @IsOptional()
  readonly refreshToken: string;
}

