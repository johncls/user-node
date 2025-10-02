import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    const userLogin = await this.authService.login(loginDto);
    if (!userLogin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return userLogin;
  }
}
