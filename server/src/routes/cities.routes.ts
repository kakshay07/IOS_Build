import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {cityModel} from '../models/cities.models'
import { ApiResponse } from "../utils/ApiResponse";


export const cityRouter=Router();


cityRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          {state_code:string;}
        >,
        res
      ) => {
        const {state_code}=req.query;
        const data = await cityModel.getAllCityWithStateCode({state_code});
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );