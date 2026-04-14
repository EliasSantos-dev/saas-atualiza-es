import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsernameOrEmail(identifier);
    if (user && await bcrypt.compare(pass, user.hashed_password)) {
      const { hashed_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.username, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
    };
  }
}
