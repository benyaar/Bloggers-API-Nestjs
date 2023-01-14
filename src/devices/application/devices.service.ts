import { DevicesRepository } from '../repository/devices.repository';
import { DeviceType } from '../schemas/devices.schema';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../../auth/repository/auth.repository';
import jwt from 'jsonwebtoken';
import { JWT } from '../../auth/constants';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly authRepository: AuthRepository,
  ) {}
  async createNewUserSession(userSession: DeviceType) {
    return this.devicesRepository.createNewUserSession(userSession);
  }
  async verifyToken(token: string) {
    try {
      const result: any = jwt.verify(token, JWT.jwt_secret);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async findDevices(refreshToken: string) {
    const findRefreshTokenInBlackList =
      await this.authRepository.findTokenInBlackList(refreshToken);
    if (findRefreshTokenInBlackList) throw new UnauthorizedException([]);
    const getDataFromToken = await this.verifyToken(refreshToken);
    if (!getDataFromToken) throw new UnauthorizedException([]);

    const userId = getDataFromToken.userId;
    return this.devicesRepository.findDevicesByUserId(userId);
  }

  async deleteUserSessions(refreshToken: string) {
    const findRefreshTokenInBlackList =
      await this.authRepository.findTokenInBlackList(refreshToken);
    if (findRefreshTokenInBlackList) throw new UnauthorizedException([]);
    const getDataFromToken = await this.verifyToken(refreshToken);
    if (!getDataFromToken) throw new UnauthorizedException([]);

    const userId = getDataFromToken.userId;
    const deviceId = getDataFromToken.deviceId;

    return this.devicesRepository.deleteUserSessions(userId, deviceId);
  }

  async deleteUserSessionById(refreshToken: string, id: string) {
    const findDeviceById = await this.devicesRepository.findDeviceByDeviceId(
      id,
    );
    if (!findDeviceById) throw new NotFoundException([]);
    const findRefreshTokenInBlackList =
      await this.authRepository.findTokenInBlackList(refreshToken);
    if (findRefreshTokenInBlackList) throw new UnauthorizedException([]);
    const getDataFromToken = await this.verifyToken(refreshToken);
    if (!getDataFromToken) throw new UnauthorizedException([]);

    const userId = getDataFromToken.userId;
    const deviceId = getDataFromToken.deviceId;
    if (findDeviceById.userId !== userId) throw new ForbiddenException([]);
    return this.devicesRepository.deleteUserSessionById(userId, id);
  }
}
//
// userSessionsRouter.delete('/devices/:deviceId', checkRefreshTokenMiddleWare, async(req:Request, res:Response) =>{
//   const deviceId = req.params.deviceId
//   const refreshToken =  req.cookies.refreshToken
//
//   const findDeviceByDeviceId = await queryRepository.findDeviceByDeviceId(deviceId)
//   if(!findDeviceByDeviceId) return  res.sendStatus(404)
//
//   const getDataFromToken = await JWTService.getDataByToken(refreshToken)
//   const userId = getDataFromToken.userId
//   const findDeviceIdFromUserId = await queryRepository.findDeviceByUseId(userId)
//   if(!findDeviceIdFromUserId) return res.sendStatus(404)
//   if(findDeviceByDeviceId.userId !== userId) return res.sendStatus(403)
//
//   await userSessionsService.deleteDeviceByDeviceId(userId, deviceId)
//   res.sendStatus(204)
// })
