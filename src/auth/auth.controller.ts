/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRespondeDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthRespondeDto> {
    return await this.authService.signIn(email, password);
  }

  @Post('register')
  async register(@Body() register: CreateUserDto) {
    return await this.authService.register(register);
  }
}
