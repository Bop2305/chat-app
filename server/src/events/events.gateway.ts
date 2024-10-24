import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your Next.js frontend
    credentials: true,
  },
})
export class EventsGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    // console.log("[Message Event] [Client] ", client);
    console.log('[Message Event] [payload] ', payload);
    this.server.emit('message', payload);
  }
}
