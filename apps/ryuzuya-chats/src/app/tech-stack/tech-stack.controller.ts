import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TechStackService } from './tech-stack.service';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';
import { ITechStackFilter } from './interfaces/tech-stack.interface';

@Controller('tech-stack')
export class TechSTackController {
  constructor(
    private readonly techStackService: TechStackService
  ) {}

  @Post()
  async create(@Body() createTechStackDto: CreateTechStackDto) {
    return this.techStackService.create(createTechStackDto);
  }

  @Get()
  async get(@Query() techStackFilter: ITechStackFilter) {
    return this.techStackService.findAll({
      stackName: techStackFilter.stackName,
      page: techStackFilter.page,
      limit: techStackFilter.limit
    });
  }

  @Get('category')
  async getWithCategory(@Query() techStackFilter: ITechStackFilter) {
    return this.techStackService.findStackCategory({
      page: techStackFilter.page,
      limit: techStackFilter.limit
    });
  }
}
