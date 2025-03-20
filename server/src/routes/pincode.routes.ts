import { Router, Response } from 'express';
import { pincodeModel } from '../models/pincode.models';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const pincodeRouter = Router();

pincodeRouter.use(authMiddleware);

pincodeRouter.get(
    '/',
    asyncHandler(
        async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          unknown,
          { state: string; city: string; limit: number; page: number }
        >,
        res: Response
      ) => {
        const data = await pincodeModel.getPincodeMaster(
          req.query.state,
          req.query.city,
          req.query.page || 0,
          req.query.limit || 15,
        );
        res.json(new ApiResponse(200 , data.data));
      }
    )
);

//  THIS IS USED ONLY FOR GETTING STATE AND CITY BASED ON PINCODE
pincodeRouter.get(
  '/getdata',
  asyncHandler(
      async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        unknown,
        { pincode: number}
      >,
      res: Response
    ) => {
      const data = await pincodeModel.getDataUsingPincodeParam(req.query.pincode
      );
      res.json(new ApiResponse(200 , data.data));
    }
  )
);

