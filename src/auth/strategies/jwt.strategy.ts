import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiretion: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
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
