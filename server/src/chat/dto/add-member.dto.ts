import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  participants: string[];
}
