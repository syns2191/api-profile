import { IsString } from 'class-validator';
export class CreateSkillCategoryDto {
  @IsString()
  categoryName: string;
}
