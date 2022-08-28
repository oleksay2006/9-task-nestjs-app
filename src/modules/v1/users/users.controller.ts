import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { IUser } from './interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const info = this.usersService.create(createUserDto);
    return info;
  }

  @Get('list')
  @UseGuards(AuthGuard())
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }
}
