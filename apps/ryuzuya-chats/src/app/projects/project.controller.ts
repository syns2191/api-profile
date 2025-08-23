import { Body, Controller, Post, Get, Query } from '@nestjs/common';
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

  @Get()
  async get(@Query() filter: IProjectFilter) {
    return this.projectService.findAll(filter);
  }

  @Get('by-user')
  async getByUser(@Query() filter: IProjectFilter) {
    return this.projectService.projectByUser(filter);
  }
}
