import { createHash, randomBytes } from 'crypto';

/** Random URL-safe token. Only its hash is stored in the database. */
export const generateToken = () => randomBytes(48).toString('base64url');

export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
