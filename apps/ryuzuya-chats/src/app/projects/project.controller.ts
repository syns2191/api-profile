import { Body, Controller, Post, Get, Query, Param, Patch } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { IProjectFilter } from './interfaces/project.interface';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() body: CreateProjectDto) {
    return this.projectService.updateById(id, body);
  }

  @Get()
  async get(@Query() filter: IProjectFilter) {
    return this.projectService.findAll(filter);
  }

  @Get('by-user')
  async getByUser(@Query() filter: IProjectFilter) {
    return this.projectService.projectByUser(filter);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.projectService.findOne({
      _id: id
    });
  }
}
