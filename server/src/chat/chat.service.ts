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
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
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

  async getChats(userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return new BadRequestException('User not found').getResponse();
      }

      const participants = await this.participantRepository.find({
        where: { userId: user.id },
      });

      const chats = await this.chatRepository.find({
        where: { participants: participants },
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

  async sendMessage(sendMessageDto: SendMessageDto) {
    try {
      const { userId, chatId, content } = sendMessageDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return new BadRequestException('User not found').getResponse();
      }

      const chat = await this.chatRepository.findOne({ where: { id: chatId } });

      if (!chat) {
        return new BadRequestException('Conversation not found').getResponse();
      }

      const message = new Message();

      message.chatId = chat.id;
      message.senderId = user.id;
      message.content = content;

      return await this.messageRepository.save(message);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
