import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginPayload } from './interfaces/login-payload.interface';
import { Refresh } from './schemas/refresh.schema';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../auth/auth.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private configService: ConfigService,
  ) { }

  async refreshToken(id) {
    try {
      const refresh = await this.findById(id);
      const user = await this.usersService.findById(id);
      if (!refresh.refreshToken) {
        throw new Error('No refresh token provided');
      }
      const refreshSecret: string = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      );
      await this.jwtService.verify(refresh.refreshToken, {
        secret: refreshSecret,
      });
      console.log(refresh);
      return this.createJwtPayload(user);
    } catch (e) {
      console.log(e);
    }
  }

  async findById(id: string): Promise<Refresh> {
    return await this.authRepository.findById(id);
  }

  async validateUserByPassword(loginAttempt: LoginUserDto) {
    // This will be used for the initial login
    const user = await this.usersService.findOneByEmail(loginAttempt.email);
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(loginAttempt.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    } else {
      return this.createJwtPayload(user);
    }
  }

  async validateUserByJwt(payload: JwtPayload): Promise<LoginPayload | Error> {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async createJwtPayload(user) {
    try {
      const data: JwtPayload = {
        email: user.email,
      };
      const refreshSecret: string = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      );
      const refreshJwt = this.jwtService.sign(data, {
        secret: refreshSecret,
        expiresIn: '10m',
      });
      await this.authRepository.initializeRefresh(user.id, refreshJwt);

      const jwt = this.jwtService.sign(data);

      return {
        expiresIn: '2m',
        token: jwt,
        refreshToken: refreshJwt,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
