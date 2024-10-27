import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Participant } from './entities/participant.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChat(userEmail: string, createChatDto: CreateChatDto) {
    try {
      const { participants } = createChatDto;

      const allParticipantsEmail = [...participants, userEmail];

      const userEntities = await this.userRepository.find({
        where: { email: In(allParticipantsEmail) },
      });

      if (userEntities.length !== allParticipantsEmail.length) {
        return new NotFoundException('One or more users not found');
      }

      const chat = this.chatRepository.create();

      await this.chatRepository.save(chat);

      const newParticipants = userEntities.map((user) => {
        const participant = new Participant();
        participant.chatId = chat.id;
        participant.userId = user.id;
        return participant;
      });

      return await this.participantRepository.save(newParticipants);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create chat');
    }
  }

  async getChats() {
    try {
      const chats = await this.chatRepository.find({
        relations: ['participants'],
      });

      return chats;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getChatById(id: number) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: id },
        relations: ['participants', 'messages'],
      });

      if (!chat) {
        return new BadRequestException().getResponse();
      }

      return chat;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
