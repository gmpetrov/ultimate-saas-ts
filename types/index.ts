import { NextApiRequest } from 'next';
import { Session } from 'next-auth';

export interface AppNextApiRequest extends NextApiRequest {
  session?: Session & {
    userId?: string;
  };
}
