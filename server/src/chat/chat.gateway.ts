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

  constructor(private readonly chatService: ChatService) {}

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
    await this.chatService.sendMessage(payload);

    const chat = await this.chatService.getChatById(payload.chatId);
    console.log('[Chat]', chat);
    this.server.to(payload.chatId.toString()).emit('receiveMessage', chat);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId.toString());
    console.log(`Client ${client.id} joined chat ${chatId}`);

    const chat = await this.chatService.getChatById(+chatId);
    this.server.to(chatId.toString()).emit('receiveMessage', chat);
  }
}
