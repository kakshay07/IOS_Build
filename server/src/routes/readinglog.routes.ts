import { Router, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {ReadingLogModel} from '../models/readinglog.model'
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";


export const readinglogRouter =Router();

readinglogRouter.get('/',
    asyncHandler(
        async (
          req: Request<
            unknown,
            unknown,
            unknown,
          {selectedMachineTab:string,selectedDate:string;entity_id:number,branch_id:number}
          >,
          res
        ) => {
          const {entity_id,branch_id,selectedDate,selectedMachineTab}=req.query
          const data = await ReadingLogModel.getReadinglogOfentryDate({entity_id,branch_id,entry_date:selectedDate,machine_name:selectedMachineTab});
          if(data){
            res.json(new ApiResponse(200 , data ,"Records fetched successfully"))
          }else {
            throw new Error('something went wrong!')
          }
        }
      )
)

readinglogRouter.post(
    "/",
    asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          entry_date:string;
          machine_name:string;
          machine_identity_no :string;
          reading:number;
          hour:number;
          sl:number ;
          new:boolean;// just for type validateions
          edited_old_data :boolean
          old_data:0 |1;
        }[],
        { entity_id: number; branch_id: number }
      >,
      res
    ) => {
      const { entity_id, branch_id } = req.query;
      const dataArray = req.body;
      const cr_by = req.user.user_id;
      const response = await ReadingLogModel.AddReadingsForMachine(entity_id,branch_id,dataArray,cr_by
      );
      if (response) {
        res.json(new ApiResponse(200, {}, "Reading saved successfully"));
      } else {
        res.json(new ApiResponse(400, {}, "failed to add reading`s"));
      }
    }
  ));

  readinglogRouter.get('/getlastmodifieddate',
    asyncHandler(
        async (
          req: Request<
            unknown,
            unknown,
            unknown,
          {selectedMachineTab:string,selectedDate:string;entity_id:number,branch_id:number}
          >,
          res
        ) => {
          const {entity_id,branch_id,selectedDate,selectedMachineTab}=req.query
          const data = await ReadingLogModel.GetLastmodifiedDate({entity_id,branch_id,entry_date:selectedDate,machine_name:selectedMachineTab});
          if(data){
            res.json(new ApiResponse(200 , data ,"Records fetched successfully"))
          }else {
            throw new Error('something went wrong!')
          }
        }
      )
)

readinglogRouter.get('/getdataforexcelldownload',
  asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
        {entity_id:number,branch_id:number,from_date:string,to_date:string,machine_name:string}
        >,
        res
      ) => {
        const {entity_id,branch_id,from_date,to_date,machine_name}=req.query
        const data = await ReadingLogModel.GetDataForExcellDownload({entity_id,branch_id,from_date,to_date,machine_name});
        if(data){
          res.json(new ApiResponse(200 , data.data ,"Records fetched successfully"))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
)

  