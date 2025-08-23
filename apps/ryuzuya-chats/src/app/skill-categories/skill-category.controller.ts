import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { SkillCategoryService } from './skill-category.service';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { ISkillCategoryFilter } from './intefaces/skill-category.interface';

@Controller('skill-categories')
export class SkillCategoryController {
  constructor(
    private readonly techStackService: SkillCategoryService
  ) {}

  @Post()
  async create(@Body() createTechStackDto: CreateSkillCategoryDto) {
    return this.techStackService.create(createTechStackDto);
  }

  @Get()
  async getProfile(@Query() filter: ISkillCategoryFilter) {
    return this.techStackService.findAll(filter);
  }
}
