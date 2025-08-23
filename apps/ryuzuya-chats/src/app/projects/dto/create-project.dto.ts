import { IsString, IsArray, IsOptional } from 'class-validator';
export class CreateProjectDto {
  @IsOptional()
  @IsString()
  readonly projectTitle: string;
  @IsOptional()
  @IsString()
  readonly prejectShortDescription: string;
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
}
