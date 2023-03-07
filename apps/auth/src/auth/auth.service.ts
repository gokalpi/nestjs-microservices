import {
  LoginDto,
  CreateUserDto,
  JwtPayload,
  User,
  TokensResponseDto,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<TokensResponseDto> {
    Logger.debug('AuthService@login.call', data);

    const { email, password } = data;

    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await user.comparePassword(password)))
      throw new RpcException('Email or password is incorrect');

    const result = await this.buildUserResponse(user);

    Logger.debug('AuthService@login.result', result);

    return result;
  }

  async register(body: CreateUserDto): Promise<TokensResponseDto> {
    Logger.debug('AuthService@register.call', body);

    if (await this.usersService.findOneByEmail(body.email))
      throw new RpcException('Email already exists');

    const user = await this.usersService.create(body);

    const result = await this.buildUserResponse(user);

    Logger.debug('AuthService@register.result', result);

    return result;
  }

  async refreshToken(refreshToken: string): Promise<TokensResponseDto> {
    Logger.debug('AuthService@refreshToken.call', refreshToken);

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    if (!payload) throw new RpcException('Access denied');

    const user = await this.usersService.findOne(payload.id);
    if (!user) throw new RpcException('Access denied');

    const result = await this.buildUserResponse(user);

    Logger.debug('AuthService@refreshToken.result', result);

    return result;
  }

  async validateToken(token: string): Promise<User> {
    Logger.debug('AuthService@validateToken.call', token);

    if (!token || !(await this.jwtService.verifyAsync(token)))
      throw new RpcException('Invalid token');

    const decoded = this.jwtService.decode(token) as JwtPayload;

    const user = await this.usersService.findOne(decoded.id);
    if (!user) throw new RpcException('Invalid token');

    Logger.debug('AuthService@validateToken.result', user);

    return user;
  }

  private async buildUserResponse(user: User): Promise<TokensResponseDto> {
    const payload = this.generatePayload(user);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generatePayload(user: User): Promise<string> {
    return JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }
}
