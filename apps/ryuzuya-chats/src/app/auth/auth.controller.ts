import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@CurrentUser() user: any, @Res({ passthrough: true }) res: any) {
    return this.authService.login({
      id: user.sub ?? user._id,
      email: user.email,
      roles: user.roles,
    } as any, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(user.sub, user.refreshToken, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.sub, res);
    return {
      ok: true
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(@CurrentUser() user: any, @Body() body: any) {
    await this.authService.changePassword(user.sub, body.newPassword, body.oldPassword);
    return {
      ok: true
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  admin() { return { secret: 'for-admins' }; }
}
