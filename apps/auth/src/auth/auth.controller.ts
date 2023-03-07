import {
  Subjects,
  LoginDto,
  CreateUserDto,
  TokensResponseDto,
  User,
} from '@app/common';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(Subjects.LoginUser)
  async login(@Payload() data: LoginDto): Promise<TokensResponseDto> {
    Logger.debug('AuthController@login.call', data);

    const result = await this.authService.login(data);

    Logger.debug('AuthController@login.result', result);

    return result;
  }

  @MessagePattern(Subjects.RegisterUser)
  async register(@Payload() data: CreateUserDto): Promise<TokensResponseDto> {
    Logger.debug('AuthController@register.call', data);

    const result = await this.authService.register(data);

    Logger.debug('AuthController@register.result', result);

    return result;
  }

  @MessagePattern(Subjects.ValidateToken)
  async refreshToken(
    @Payload() refreshToken: string,
  ): Promise<TokensResponseDto> {
    Logger.debug('AuthController@refreshToken.call', refreshToken);

    const result = await this.authService.refreshToken(refreshToken);

    Logger.debug('AuthController@refreshToken.result', result);

    return result;
  }

  @MessagePattern(Subjects.ValidateToken)
  async validateToken(@Payload() token: string): Promise<User> {
    Logger.debug('AuthController@validateToken.call', token);

    const result = await this.authService.validateToken(token);

    Logger.debug('AuthController@validateToken.result', result);

    return result;
  }
}
