import { Module } from '@nestjs/common';
import { SkillCategoryService } from './skill-category.service';
import { SkillCategoryController } from './skill-category.controller';
import { DatabaseModule } from '../database/database.module';
import { skillCategoryProviders } from './skill-category.providers';
@Module({
  imports: [DatabaseModule],
  providers: [SkillCategoryService, ...skillCategoryProviders],
  controllers: [SkillCategoryController],
})
export class SkillCategoryModule {}
