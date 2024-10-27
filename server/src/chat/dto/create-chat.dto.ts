import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  participants: string[];
}
