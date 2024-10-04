/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthRespondeDto } from './dto/auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
  }

  async signIn(email: string, password: string): Promise<AuthRespondeDto> {
    const foundUser = await this.userService.findUserByEmail(email);

    if (!foundUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (foundUser && !bcryptCompareSync(password, foundUser.password)) {
      throw new UnauthorizedException('Credenciais incorretas');
    }

    const payload = { sub: foundUser._id, email: foundUser.email };

    const token = this.jwtService.sign(payload);

    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
