import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InternalUserJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      const auth = request.headers['authorization'] as string | undefined;
      if (!auth?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing Authorization header');
      }

      const token = auth.slice('Bearer '.length);
      const payload = this.jwtService.verify(token);

      if (payload.token_type !== 'user') {
        throw new UnauthorizedException('Invalid token type');
      }

      request.userCtx = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid user token');
    }
  }
}
