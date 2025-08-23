import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { UserModule } from '../users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
