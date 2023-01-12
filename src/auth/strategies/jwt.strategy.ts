import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';
import { JWT } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT.jwt_secret,
      //passReqToCallback: true,
    });
  }
  async validate(payload: any) {
    const findUserById = await this.usersQueryRepository.findUserById(
      payload.userId,
    );
    if (!findUserById) throw new NotFoundException([]);
    return findUserById;
  }
}
