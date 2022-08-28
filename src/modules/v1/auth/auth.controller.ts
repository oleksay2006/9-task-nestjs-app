import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LoginPayload } from './interfaces/login-payload.interface';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginPayload> {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  @Post('refresh/:id')
  async refresh(@Param() params) {
    return await this.authService.refreshToken(params.id);
  }
}
