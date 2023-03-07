import {
  CreateUserDto,
  GetUser,
  LoginDto,
  TokensResponseDto,
  User,
} from '@app/common';
import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Logger,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UseAuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'User login successful',
    type: TokensResponseDto,
  })
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    Logger.debug('AuthController@login.call', data);

    const result = await this.authService.login(data);

    Logger.debug('AuthController@login.result', result);

    if (result) {
      res.cookie('Authentication', result.accessToken, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { accessToken: result.accessToken };
    }

    return null;
  }

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiOkResponse({
    description: 'User register successful',
    type: TokensResponseDto,
  })
  async register(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    Logger.debug('AuthController@register.call', data);

    const result = await this.authService.register(data);

    res.cookie('Authentication', result.accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    Logger.debug('AuthController@login.register', result);

    return { accessToken: result.accessToken };
  }

  @Post('refresh-token')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({
    description: 'Current user register successful',
    type: User,
  })
  async refreshToken(@Req() req: Request) {
    Logger.debug('AuthController@refreshToken.call');

    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new BadRequestException('No refresh token found');

    const accessToken = await this.authService.refreshToken(refreshToken);

    Logger.debug('AuthController@refreshToken.register', accessToken);

    return { accessToken };
  }

  @Get('me')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({
    description: 'Current user register successful',
    type: User,
  })
  async me(@GetUser() user: User): Promise<User> {
    return user;
  }
}
