// import {
//   Injectable,
//   NestMiddleware,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { JwtService } from '../application/jwt.service';
// import { UsersQueryRepository } from '../../users/repository/users.query-repository';
// import { AuthRepository } from '../repository/auth.repository';
//
// @Injectable()
// export class CheckRefreshTokenMiddleware implements NestMiddleware {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly usersQueryRepository: UsersQueryRepository,
//     private readonly authRepository: AuthRepository,
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) throw new UnauthorizedException([]);
//
//     const checkVerifyToken = await this.jwtService.getDataByToken(refreshToken);
//     if (!checkVerifyToken) throw new UnauthorizedException([]);
//
//     const findUserById = await this.usersQueryRepository.findUserById(
//       checkVerifyToken.userId,
//     );
//     if (!findUserById) throw new NotFoundException([]);
//
//     const findTokenInBlackList = await this.authRepository.findTokenInBlackList(
//       refreshToken,
//     );
//     if (findTokenInBlackList) throw new NotFoundException([]);
//
//     // const deviceId = checkVerifyToken.deviceId
//     // const findDeviceByDeviceId = await queryRepository.findDeviceByDeviceId(deviceId)
//     // if(!findDeviceByDeviceId) return res.sendStatus(401)
//
//     next();
//   }
// }
