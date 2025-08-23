import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { DatabaseModule } from '../database/database.module';
import { integrationProviders } from './integration.providers';
@Module({
  imports: [DatabaseModule],
  providers: [IntegrationService, ...integrationProviders],
  controllers: [IntegrationController],
  exports: [IntegrationService]
})
export class IntegrationModule {}

