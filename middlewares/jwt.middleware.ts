import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) res.status(401).json({
    message: 'No token attached'
  });

  const key = authorization?.split(' ')[1] as string;
  if (!key) res.status(401).json({
    message: 'Invalid authorization'
  })

  try {
    const payload = jwt.verify(key, TOKEN_SECRET);
    next();
  }

  catch(err) {
    res.status(401).json({
      message: err
    });
  }
}