import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {stateModel} from '../models/state.models'
import { ApiResponse } from "../utils/ApiResponse";


export const stateRouter=Router();


stateRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
        {country_code:string;}
        >,
        res
      ) => {
        const {country_code}=req.query
        const data = await stateModel.getAllStateWithCountryCode({country_code});
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );