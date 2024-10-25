import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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

    const verifyPassword = await user.validatePassword(password);

    if (user && verifyPassword) {
      delete user.salt;
      delete user.password;

      return user;
    } else {
      return null;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        return null;
      }

      delete user.password;
      delete user.salt;

      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userResult = await this.userRepository.findOneBy({ id });

      if (!userResult) {
        throw new BadRequestException("Invalid User")
      }

      const { firstName, lastName, email } = updateUserDto;

      userResult.firstName = firstName;
      userResult.lastName = lastName;
      userResult.email = email;

      await this.userRepository.save(userResult);

      delete userResult.password;
      delete userResult.salt

      return userResult;
    } catch (error) {
      console.log(error);
    }
  }
}
