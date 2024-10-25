import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserById(userId: number) {
    return await this.userService.findById(userId);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const userResult = await this.userService.signIn(loginDto);

    if (!userResult) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const payload = { userResult };

    const accessToken = await this.jwtService.sign(payload);

    const loginResponse = { user: userResult, accessToken };

    return loginResponse;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    return this.userService.create(signUpDto);
  }
}
