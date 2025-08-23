import { Body, Controller, Post, Get, Query, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserFilter } from './interfaces/users.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  async getProfile() {
    return this.userService.findOne({email: 'sutralian@gmail.com'});
  }

  @Get()
  async get(@Query() filter: IUserFilter) {
    return this.userService.findAll(filter);
  }

  @Patch(':userId')
  async updateUser(@Body() createUserDto: CreateUserDto, @Param() param: {userId: string}) {
    console.log('createUserDto', createUserDto);
    return this.userService.updateUser(param.userId, createUserDto);
  }

  @Get('skills/:userId')
  async getUserSkill(@Param() param: {userId: string}) {
    return this.userService.getUserSkill(param.userId);
  }
}
