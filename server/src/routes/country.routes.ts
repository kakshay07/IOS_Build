import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {countryModel} from '../models/country.models'
import { ApiResponse } from "../utils/ApiResponse";


export const countryRouter=Router();


countryRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,{entity_id:string;}
        >,
        res
      ) => {
        const data = await countryModel.getAllCountryWithCode();
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );