import { DevicesService } from '../application/devices.service';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('/devices')
  async findDevices(@Req() req: Request) {
    const refreshToken = req.cookies.cookies;
    return this.devicesService.findDevices(refreshToken);
  }
}

//
//
// userSessionsRouter.delete('/devices', attemptsMiddleware, checkRefreshTokenMiddleWare, async(req:Request, res:Response) =>{
//   const refreshToken =  req.cookies.refreshToken
//   const getDataFromToken = await JWTService.getDataByToken(refreshToken)
//   const userId = getDataFromToken.userId
//   const deviceId = getDataFromToken.deviceId
//
//   await userSessionsService.deleteAllDevice(userId, deviceId)
//   res.sendStatus(204)
// })
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
