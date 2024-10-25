import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findById(@Request() req) {
    console.log("[req]", req);
    return this.userService.findById(req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  update(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user?.id, data)
  }
}
