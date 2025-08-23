import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { ISkillCategory, ISkillCategoryFilter } from './intefaces/skill-category.interface';

@Injectable()
export class SkillCategoryService {
  constructor(
    @Inject('SKILL_CATEGORIES_MODEL')
    private readonly skillCategoryModel: Model<ISkillCategory>
  ) { }

  async create(createSkillCategory: CreateSkillCategoryDto): Promise<ISkillCategory> {
    const createdUser = await this.skillCategoryModel.create(createSkillCategory);
    return createdUser;
  }

  async findOne(skillCategory: Partial<ISkillCategory>): Promise<ISkillCategory> {
    const stackData = await this.skillCategoryModel.findOne({
      email: skillCategory.categoryName
    });
    return stackData;
  }

  async findAll(skillCategory: Partial<ISkillCategoryFilter>): Promise<ISkillCategory[]> {
    const skillCategories = await this.skillCategoryModel.find({
      categoryName: { $regex: skillCategory.categoryName, $options: 'i' }
    }).limit(skillCategory.limit).skip(skillCategory.page * skillCategory.limit);
    return skillCategories;
  }

  async findById(skillCategory: Partial<ISkillCategory>): Promise<ISkillCategory> {
    const stackData = await this.skillCategoryModel.findOne({
      _id: skillCategory._id
    });
    return stackData;
  }
}
