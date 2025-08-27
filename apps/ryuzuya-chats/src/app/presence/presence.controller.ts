import { Controller, Get } from '@nestjs/common';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(
    private presenceService: PresenceService
  ) {}

  @Get('status')
  async status() {
    return {
      online: await this.presenceService.isOnline()
    }
  }
}
