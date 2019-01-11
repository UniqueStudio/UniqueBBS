import jwt from 'jsonwebtoken';
import { secret } from './consts';

export const verifyJWT = (token?: string) => {
    if (!token) {
        throw new Error('No token provided');
    }
    if (token.indexOf('Bearer ') === 0) {
        token = token.replace('Bearer ', '');
    }
    return jwt.verify(token, secret) as object;
};
