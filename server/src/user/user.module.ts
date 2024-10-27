import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Participant } from 'src/chat/entities/participant.entity';
import { Message } from 'src/chat/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Participant, Message])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
