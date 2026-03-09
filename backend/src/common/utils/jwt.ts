import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const SECRET = process.env.JWT_SECRET || 'supersecretjwtkeythatshouldbechangedinproduction';

export interface JwtPayload {
    userId: string;
    role: Role;
    schoolId?: string;
    // Student specific fields for game integration
    id?: string;
    username?: string;
    birthdate?: string;
    school_id?: string;
    ano_escolar?: string;
    coins?: number;
    persona?: number;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' }); // Increased to 7d for better game experience
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET) as JwtPayload;
};
