import { Injectable } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { AuthRepository } from '../auth/auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRefreshDto } from '../auth/dto/create-refresh.dto';
import { CreatedUserPayload } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreatedUserPayload> {
    const newUser = await this.usersRepository.create(createUserDto);
    const payload: CreateRefreshDto = {
      refreshToken: '',
      _id: newUser._id,
      firstname: newUser.firstname,
    };
    const newRefresh = await this.authRepository.create(payload);
    return {
      message: 'User created',
      data: {
        user: newUser,
        refresh: newRefresh,
      },
    };
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.usersRepository.findAll();
  }

  async findById(id): Promise<UserDocument> {
    return await this.usersRepository.findById(id);
  }

  async findOneByEmail(email): Promise<UserDocument> {
    return await this.usersRepository.findOneByEmail(email);
  }
}
