import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { AttemptsDocument, Attempt } from '../schemas/attempts.schema';
import { Model } from 'mongoose';

@Injectable()
export class AttemptsMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptsDocument>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const url = req.url;
    const date = new Date();
    const limitTime = new Date(new Date().getTime() - 10000);

    const attempt: Attempt = {
      userIP: ip,
      url: url,
      time: date,
    };

    const countOfAttempts = await this.attemptModel.countDocuments({
      userIP: ip,
      url: url,
      time: { $gt: limitTime },
    });
    await this.attemptModel.insertMany(attempt);

    if (countOfAttempts < 5) {
      next();
    } else {
      res.sendStatus(429);
    }
  }
}
