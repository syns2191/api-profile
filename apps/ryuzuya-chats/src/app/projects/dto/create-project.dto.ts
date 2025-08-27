import { IsString, IsArray, IsOptional } from 'class-validator';
export class CreateProjectDto {
  @IsOptional()
  @IsString()
  readonly projectTitle: string;
  @IsOptional()
  @IsString()
  readonly projectShortDescription: string;
  @IsOptional()
  @IsString()
  readonly projectImage: string;
  @IsOptional()
  @IsString()
  readonly projectDemoLink: string;
  @IsOptional()
  @IsString()
  readonly projectCodeLink: string;
  @IsOptional()
  @IsArray()
  readonly projectTeachStack: string[];

  @IsOptional()
  @IsString()
  readonly user: string;
}
