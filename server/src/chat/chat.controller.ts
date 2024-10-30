import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getChats(@Request() req) {
    return this.chatService.getChats(req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createChat(@Request() req, @Body() data: CreateChatDto) {
    return this.chatService.createChat(req.user?.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getChatById(@Param() params: { id: string }) {
    const { id } = params;
    return this.chatService.getChatById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-member/:chatId')
  addMember(
    @Request() req,
    @Param() params: { chatId: string },
    @Body() data: string[],
  ) {
    const { chatId } = params;
    const userId = req.user?.id;
    return this.chatService.addMember(+userId, +chatId, data);
  }
}
