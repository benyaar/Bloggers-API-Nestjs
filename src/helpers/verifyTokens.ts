import jwt from 'jsonwebtoken';

// type JwtPair = {
//   accessToken: string;
//   refreshToken: string;
// };

export const verifyTokens = async (token: string) => {
  try {
    const result: any = jwt.verify(token, process.env.JWT_SECRET);
    return result;
  } catch (error) {
    return null;
  }
};
