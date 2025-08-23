import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DatabaseModule } from '../database/database.module';
import { projectProviders } from './project.providers';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectService, ...projectProviders],
  controllers: [ProjectController],
})
export class ProjectModule {}
