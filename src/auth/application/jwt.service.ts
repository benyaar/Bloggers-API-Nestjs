import jwt from 'jsonwebtoken';

export class JwtService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async getDataByToken2(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }
}
