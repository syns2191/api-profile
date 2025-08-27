import { Body, Controller, Post, Get, Query, Param, Patch } from '@nestjs/common';
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

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.techStackService.findOne({_id: id});
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() body: CreateSkillCategoryDto) {
    return this.techStackService.updateOne(id, body);
  }
}
