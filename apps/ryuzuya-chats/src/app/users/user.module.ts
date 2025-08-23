import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...usersProviders],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
