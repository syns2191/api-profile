import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { IIntegration } from './interfaces/integration.interface';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject('INTEGRATION_MODEL')
    private readonly integrationModel: Model<IIntegration>
  ) { }

  async create(createIntegrationDto: CreateIntegrationDto): Promise<IIntegration> {
    const createdIntgration = await this.integrationModel.create(createIntegrationDto);
    return createdIntgration;
  }

  async findByUserChannel(userId: string, channel: string): Promise<IIntegration> {
    const channelIntgration = await this.integrationModel.findOne({
      user: userId,
      channel
    });
    return channelIntgration;
  }
}
