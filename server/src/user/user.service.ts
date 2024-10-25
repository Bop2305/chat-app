import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/signin.dto';
import { SignInResponseDto } from './dto/signin-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await this.userRepository.save(user);

      delete user.salt;
      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOneBy({ email });

    if (user && user.validatePassword(password)) {
      delete user.salt;
      delete user.password;

      return user;
    } else {
      return null;
    }
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user.id;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
