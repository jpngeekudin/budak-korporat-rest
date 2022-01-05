import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export function generateJwt(username: string) {
  const jwt = jsonwebtoken.sign({ username }, TOKEN_SECRET, { expiresIn: '1d' });
  return jwt;
}