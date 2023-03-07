import {
  AUTH_SERVICE,
  CreateUserDto,
  LoginDto,
  Subjects,
  TokensResponseDto,
  User,
} from '@app/common';
import {
  Injectable,
  Inject,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  async login(data: LoginDto): Promise<TokensResponseDto> {
    Logger.debug('AuthService@login.call', data);

    const result = await firstValueFrom(
      this.client.send(Subjects.LoginUser, data).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );

    Logger.debug('AuthService@login.result', result);

    return result;
  }

  async register(body: CreateUserDto): Promise<TokensResponseDto> {
    Logger.debug('AuthService@register.call', body);

    const result = await firstValueFrom(
      this.client.send(Subjects.RegisterUser, body).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );

    Logger.debug('AuthService@register.result', result);

    return result;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    Logger.debug('AuthService@refreshToken.call', refreshToken);

    const result = await firstValueFrom(
      this.client.send(Subjects.RefreshToken, refreshToken).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );

    Logger.debug('AuthService@refreshToken.result', result);

    return result;
  }

  async validateToken(token: string): Promise<User> {
    Logger.debug('AuthService@validateToken.call', token);

    const user = await firstValueFrom(
      this.client.send(Subjects.ValidateToken, token).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );

    Logger.debug('AuthService@validateToken.result', user);

    return user;
  }
}
