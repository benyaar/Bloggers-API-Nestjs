import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../auth/application/jwt.service';
import jwt from 'jsonwebtoken';
import { JWT } from '../auth/constants';

export const Token = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers.authorization;
    if (!headers) return;

    const token = headers.split(' ')[1];

    try {
      const result: any = jwt.verify(token, JWT.jwt_secret);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
);
