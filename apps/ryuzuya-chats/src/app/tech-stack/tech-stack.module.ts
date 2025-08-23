import { Module } from '@nestjs/common';
import { TechStackService } from './tech-stack.service';
import { TechSTackController } from './tech-stack.controller';
import { DatabaseModule } from '../database/database.module';
import { techStackProviders } from './tech-stack.providers';
@Module({
  imports: [DatabaseModule],
  providers: [TechStackService, ...techStackProviders],
  controllers: [TechSTackController],
})
export class TechStackModule {}
