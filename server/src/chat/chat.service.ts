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
import { UpdateChatDto } from './dto/update-chat.dto';

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

  async createChat(
    userEmail: string,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    try {
      const { participants } = createChatDto;

      const allParticipantsEmail = [...participants, userEmail];

      const userEntities = await this.userRepository.find({
        where: { email: In(allParticipantsEmail) },
      });

      if (userEntities.length !== allParticipantsEmail.length) {
        throw new NotFoundException('One or more users not found');
      }

      // Check for existing conversation with these participants
      const participantIds = userEntities.map((user) => user.id);
      const existingChat = await this.chatRepository
        .createQueryBuilder('chat')
        .innerJoin('chat.participants', 'participant')
        .where('participant.userId IN (:...participantIds)', { participantIds })
        .groupBy('chat.id')
        .having('COUNT(DISTINCT participant.userId) = :count', {
          count: participantIds.length,
        })
        .getOne();

      // If a chat with the same participants exists, return it
      if (existingChat) {
        return existingChat;
      }

      const chat = this.chatRepository.create();

      await this.chatRepository.save(chat);

      const newParticipants = userEntities.map((user) => {
        const participant = new Participant();
        participant.chatId = chat.id;
        participant.userId = user.id;
        return participant;
      });

      await this.participantRepository.save(newParticipants);

      return await this.chatRepository.findOne({
        where: { id: chat.id },
        relations: ['participants'],
      });
    } catch (error) {
      // throw new InternalServerErrorException('Failed to create chat');
      return error;
    }
  }

  async addMember(userId: number, chatId: number, participants: string[]) {
    try {
      console.log('[userId]', userId);
      console.log('[chatId]', chatId);
      const existedChat = await this.chatRepository.findOne({
        where: { id: chatId, participants: { userId: In([userId]) } },
        relations: ['participants'],
      });

      console.log('[existedChat]', existedChat);

      const chat = await this.chatRepository.findOne({
        where: { id: existedChat.id },
        relations: ['participants'],
      });

      console.log('[chat]', chat);

      if (!chat) {
        throw new BadRequestException('Chat not found');
      }

      const users = await this.userRepository.find({
        where: { email: In(participants) },
      });

      if (users.length !== participants.length) {
        throw new NotFoundException('One or more users not found');
      }

      // Check if any of the users are already participants
      const existingParticipantIds = chat.participants.map(
        (participant) => participant.userId,
      );
      console.log('[existingParticipantIds]', existingParticipantIds);

      const existedUser = users.filter((user) =>
        existingParticipantIds.includes(user.id),
      );
      console.log('[existedUser]', existedUser);

      if (existedUser.length > 0) {
        const existedUserMails = existedUser.map((user) => user.email);
        throw new BadRequestException(`${existedUserMails} already existed`);
      }

      // Map new users to Participant entities
      const newParticipants = users.map((user) => {
        const pa = new Participant();
        pa.userId = user.id;
        pa.chatId = chatId;
        return pa;
      });

      return this.participantRepository.save(newParticipants);
    } catch (error) {
      // throw new InternalServerErrorException();
      throw error;
    }
  }

  async getChats(userId: number): Promise<Chat[]> {
    try {
      console.log('[userId]', userId);
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const participants = await this.participantRepository.find({
        where: { userId: user.id },
      });

      console.log('[participants]', participants);

      const chats = await this.chatRepository.find({
        where: {
          participants: { id: In(participants.map((item) => item.id)) },
        },
        relations: ['participants'],
      });

      return chats;
    } catch (error) {
      // throw new InternalServerErrorException();
      return error;
    }
  }

  async getChatById(id: number): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: id },
        relations: ['participants', 'messages'],
      });

      if (!chat) {
        throw new BadRequestException();
      }

      return chat;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    try {
      const { userId, chatId, content } = sendMessageDto;

      const chat = await this.chatRepository.findOne({
        where: { id: chatId, participants: { userId } },
      });

      if (!chat) {
        throw new BadRequestException('Conversation not found');
      }

      const message = new Message();

      message.chatId = chat.id;
      message.senderId = userId;
      message.content = content;

      return await this.messageRepository.save(message);
    } catch (error) {
      // throw new InternalServerErrorException();
      return error;
    }
  }
}
