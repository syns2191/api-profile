import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';

@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ) {}

  @Post()
  async create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationService.create(createIntegrationDto);
  }
}
