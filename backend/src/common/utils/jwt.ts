import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const SECRET = process.env.JWT_SECRET || 'supersecretjwtkeythatshouldbechangedinproduction';

export interface JwtPayload {
    userId: string;
    role: Role;
    schoolId?: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET) as JwtPayload;
};
