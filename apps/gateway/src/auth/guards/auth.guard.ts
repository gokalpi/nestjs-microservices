import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookie('Authentication');
    if (!token) throw new UnauthorizedException('Invalid token');

    const user = await this.authService.validateToken(token);

    request.user = user;
    return true;
  }
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
