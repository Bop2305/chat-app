import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthService } from 'src/auth/auth.service';
import { BadGatewayException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your Next.js frontend
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: SendMessageDto) {
    const authorization = client.handshake.headers.authorization;
    const token = authorization?.substring(7, authorization.length);
    if (!token) {
      throw new BadGatewayException('Authorization token not found');
    }

    // Verify JWT and create a new chat
    const jwtPayload = await this.authService.verifyToken(token);

    await this.chatService.sendMessage(payload);

    const chat = await this.chatService.getChatById(payload.chatId);

    if (!chat) {
      return;
    }

    this.server.to(payload.chatId.toString()).emit('receiveMessage', chat);

    for (const participant of chat.participants) {
      if (participant?.userId === jwtPayload?.id) return;
      this.server
        .to(participant?.userId?.toString())
        .emit('notifications', 'Notification');
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId.toString());
    console.log(`Client ${client.id} joined chat ${chatId}`);

    const chat = await this.chatService.getChatById(+chatId);
    this.server.to(chatId.toString()).emit('receiveMessage', chat);
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(client: Socket, payload: CreateChatDto) {
    const authorization = client.handshake.headers.authorization;
    const token = authorization?.substring(7, authorization.length);
    if (!token) {
      throw new BadGatewayException('Authorization token not found');
    }

    // Verify JWT and create a new chat
    const jwtPayload = await this.authService.verifyToken(token);

    // Create chat and notify participants
    const createdChat = await this.chatService.createChat(
      jwtPayload.email,
      payload,
    );

    if (!createdChat?.participants) {
      return;
    }

    for (const participant of createdChat.participants) {
      const chats = await this.chatService.getChats(participant.userId);
      this.server
        .to(participant?.userId?.toString())
        .emit('fetchConversations', chats);
    }
  }

  @SubscribeMessage('joinNamespace')
  async handleJoinNamespace(client: Socket) {
    const authorization = client.handshake.headers.authorization;
    const token = authorization?.substring(7, authorization.length);
    if (!token) {
      throw new BadGatewayException('Authorization token not found');
    }

    // Verify JWT and create a new chat
    const jwtPayload = await this.authService.verifyToken(token);

    const userId = jwtPayload.id;

    client.join(userId?.toString());

    const chats = await this.chatService.getChats(userId);
    this.server.to(userId?.toString()).emit('fetchConversations', chats);
  }
}
