import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { getConnection } from '../utils/db';
import notificationModel from '../models/notification.models';


export interface AuthenticatedRequest<
  P = unknown, // Params type
  ResBody = unknown, // Response body type
  ReqBody = unknown, // Request body type
  ReqQuery = unknown // Request query type
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: any;
}

export const authMiddleware =async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('url', req.url);

  if (req.url === '/user/login') return next();
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const userDetails = verifyToken(token);
      await SessionValidation(userDetails , token)
      req.user = userDetails;
       next();
      return
       } catch (error : any) {
        if (error instanceof TokenExpiredError) {
          try {
            const userDetails = jwt.decode(token) as JwtPayload | { [key: string]: any };
            const conn = await getConnection();
            await conn.query(
              `UPDATE session SET log_type = 'LO' , logout_time=NOW() WHERE user_id = ? and entity_id = ? AND token = ? and log_type='LI'`,
              [userDetails.user_id,userDetails.entity_id, token]
            );

            await notificationModel.unsubscriobeUser({entity_id: userDetails.entity_id, user_id: userDetails.user_id});

            return res.status(500).json({ message: 'Token Expired', code: 120 });
          } catch (dbError) {
            return res.status(500).json({ message: 'Failed to update session', code: 120 });
          }
        }
      return res.status(500).json({ message: error.message || 'Invalid Token', code: 120 });
    }
  }

  res.status(500).json({ message: 'Invalid Token', code: 120 });
};


  export const verifyToken = (token: string): JwtPayload | { [key: string]: any }  => {
    return jwt.verify(token, 'jai shri ram') as JwtPayload | { [key: string]: any };
  };

  export const generateToken = (data : any) => {
    return jwt.sign(data, 'jai shri ram', {
      expiresIn: '1d',
    });
  };

  export const SessionValidation = async (
    userDetails: jwt.JwtPayload | { [key: string]: any },
    token: string
  ) => {
    try {
      const conn = await getConnection();
      const [session] = await conn.query(
        `SELECT log_type FROM session WHERE user_id = ? AND token = ? ORDER BY session_id DESC LIMIT 1`,
        [userDetails.user_id, token]
      );

      const currentDate = new Date();
      const loginDate = new Date(userDetails.iat * 1000);
      if (
        currentDate.getDate() !== loginDate.getDate() ||
        currentDate.getMonth() !== loginDate.getMonth() ||
        currentDate.getFullYear() !== loginDate.getFullYear()
      ) {
        conn.query(
          `UPDATE session SET log_type = 'LO' , logout_time=NOW() WHERE user_id = ? and entity_id = ? AND token = ? and log_type='LI'`,
          [userDetails.user_id, userDetails.entity_id, token]
        );
        throw new Error("Token expired due to date and time change");
      }

      if (!session || session.log_type === "LO") {
        throw new Error("Session logged out");
      }

      return "Success";
    } catch (error: any) {
      throw new Error(error.message || "Session validation error");
    }
  };
  