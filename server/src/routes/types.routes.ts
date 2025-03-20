import { Router, Request } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";
import { TypesModel } from "../models/types.model";

export const typesRouter = Router();

typesRouter.get(
    '/',
    asyncHandler(async (
      req: Request<
        unknown,
        unknown,
        unknown,
        { entity_id:number,branch_id:number,type_name:string,page:number,limit:number }
      >,
      res
    ) => {
      const data = await TypesModel.GetAllTypes(
        req.query.entity_id,
        req.query.branch_id,
        req.query.type_name,
         req.query.limit
         ,req.query.page,
      );
      const serializedData=data.data.map((_:any)=>({
        ..._,
        types_count:Number(_.types_count)

      }))
      res.json(new ApiResponse(200 ,serializedData,""));
    })
  );

  typesRouter.get(
    '/name',
    asyncHandler(async (
      req: Request<
        unknown,
        unknown,
        unknown,
        { entity_id:number,branch_id:number;typeName:string;machine_name:string }
      >,
      res
    ) => {
      const data = await TypesModel.GetAllTypesByTypeName(
        req.query.entity_id,
        req.query.branch_id,
        req.query.typeName,
        req.query.machine_name
      );
      res.json(new ApiResponse(200 ,  data.data ,""));
    })
  );

  typesRouter.get(
    '/allTypes',
    asyncHandler(async (
      req: Request<
        unknown,
        unknown,
        unknown,
        { entity_id:number,branch_id:number; }
      >,
      res
    ) => {
      const data = await TypesModel.GetAllTypesName(
        req.query.entity_id,
        req.query.branch_id,
      );
      res.json(new ApiResponse(200 ,  data.data ,""));
    })
  );

typesRouter.post(
  "/",
  async (
    req: AuthenticatedRequest<
      unknown,
      unknown,
      { 
        machine_name:string
        type_name: string;
        type_desc: string;
        measure_unit: string;
      }[],
      { entity_id: number; branch_id: number }
    >,
    res
  ) => {
    const { entity_id, branch_id } = req.query;
    const typesarray = req.body;
    const cr_by = req.user.user_id;
    const response = await TypesModel.AddTypesData(
      entity_id,
      branch_id,
      typesarray,
      cr_by
    );
    if (response) {
      res.json(new ApiResponse(200, {}, "Types added successfully"));
    } else {
      res.json(new ApiResponse(400, {}, "failed to add"));
    }
  }
);


typesRouter.post(
    '/status',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          { 
            type_name:string;
            is_active:number
          },{
            entity_id:number,
            branch_id:number
          }
        >,
        res
      ) => {
        const data = req.body;
        const {entity_id,branch_id} =req.query;
        const mo_by=req.user.user_id
        const response = await TypesModel.UpdateActiveInactiveStatus({...data,mo_by:mo_by,entity_id,branch_id})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Is active status Updated successfully'))
        }else {
          throw new Error('Could not update')
        }
      }
    )
  );

  typesRouter.put(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            machine_name:string;
            type_name: string;
            type_desc: string;
            measure_unit: string;
            cr_on:string;
            cr_by:number
          }[],{
            entity_id:number,
            branch_id:number
          }
        >,
        res
      ) => {
        const { entity_id, branch_id } = req.query;
        const typesarray = req.body;
        const mo_by = req.user.user_id;
        const response = await TypesModel.UpdateTypesData(entity_id,branch_id,typesarray,mo_by)
        if(response){
          res.json(new ApiResponse(200 , {} , 'Type Updated successfully'))
        }else {
          throw new Error('Could not update')
        }
      }
    )
  )