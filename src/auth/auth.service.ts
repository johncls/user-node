import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }


  async login(user: any) {
    const userValidate = await this.validateUser(user.email, user.password);
    console.log(userValidate);
    if (userValidate === null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: userValidate.email, sub: userValidate.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET || 'your-secret-key'
    });
  }
  
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const passwordCompare = await bcrypt.compare(password, user?.password.toString() ?? '');
    console.log('user', user, 'validateUser', passwordCompare, 'password', password);
    if (user && passwordCompare) {
      return user;
    }
    return null;
  }

}

