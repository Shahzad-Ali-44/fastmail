import jwt, { type JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

const getSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET env variable is not set');
    }
    return secret;
};

export const signToken = (payload: object): string => {
    return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, getSecret()) as JwtPayload;
};
