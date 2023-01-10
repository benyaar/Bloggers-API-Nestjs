import jwt from 'jsonwebtoken';

export class JwtService {
  constructor() {}
  async getDataByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }
}
