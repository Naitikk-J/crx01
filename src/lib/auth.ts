import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthPayload {
  userId: string;
  walletAddress: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyJwt = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getAuthPayload = (req: NextRequest): AuthPayload | null => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
  
    const token = authHeader.substring(7);
    return verifyJwt(token);
}
