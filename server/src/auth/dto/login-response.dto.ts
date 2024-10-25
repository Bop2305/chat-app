import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignInResponseDto } from 'src/user/dto/signin-response.dto';

export class LoginResponseDto {
  @IsNotEmpty()
  user: SignInResponseDto;

  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
