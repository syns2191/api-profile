import { IsString, IsArray, IsOptional } from 'class-validator';
export class CreateTechStackDto {
  @IsOptional()
  @IsString()
  stackName: string;

  @IsOptional()
  @IsString()
  stackIcon: string;

  @IsOptional()
  @IsArray()
  categories: [];
}
