import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { IProject, IProjectFilter } from './interfaces/project.interface';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_MODEL')
    private readonly projectModel: Model<IProject>
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<IProject> {
    const createdProject = await this.projectModel.create(createProjectDto);
    return createdProject;
  }

  async updateById(id: string, createProjectDto: CreateProjectDto): Promise<IProject> {
    const updated = await this.projectModel.findOneAndUpdate(
      {_id: id},
      {$set: {
        projectTitle: createProjectDto.projectTitle,
        projectShortDescription: createProjectDto.projectShortDescription,
        projectTeachStack: createProjectDto.projectTeachStack
      }}
    )
    return updated;
  }

  async findOne(project: Partial<IProject>): Promise<IProject> {
    const projectData = await this.projectModel.findOne({
      _id: project._id
    }).populate('projectTeachStack');
    return projectData;
  }

  async findAll(project: Partial<IProjectFilter>): Promise<IProject[]> {
    const projectData = await this.projectModel.find({
      projectTitle: {$regex: project.projectTitle, $options: 'i'}
    })
      .limit(project.limit)
      .skip(project.page * project.limit);
    return projectData;
  }

  async projectByUser(project: Partial<IProjectFilter>): Promise<IProject[]> {
    const projectData = await this.projectModel.find({
      user: project.user
    }).populate('projectTeachStack');
    return projectData;
  }

}
