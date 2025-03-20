import { Request, Router } from "express";
import { pageModel } from "../models/page.models";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";


export const pageRouter = Router();

pageRouter.get(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          unknown,
          { entity_id: string;}
        >,
        res
      ) => {
        const {is_superadmin} = req.user;
        const data = await pageModel.getAllPages(is_superadmin);
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('Cannot get all pages')
        }
      }
    )
  );

  pageRouter.get(
    '/toGiveAccess',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          unknown,
          { entity_id: string;}
        >,
        res
      ) => {
        const data = await pageModel.getAllPages_Except_accessForAll({
          entity_id : req.user.entity_id,
          role_id : req.user.role_id,
          is_superadmin : req.user.is_superadmin
        });
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('Cannot get all pages')
        }
      }
    )
  );

  pageRouter.put(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            page_id : number,
            page_name : string,
            name : string,
            description : string,
            superadmin_only : 1 | 0 ,
            access_for_all : 1 | 0,
            extra_actions:{
              action_name:string,
              action_desc:string
            }[];
          }
        >,
        res
      ) => {
        const data = req.body;
        const mo_by=req.user.user_id
        const response = await pageModel.updatePage({...data,mo_by:mo_by})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Page updated successfully'))
        }else {
          throw new Error('Could not update')
        }
      }
    )
    
  );

  pageRouter.post(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            page_name : string,
            name : string,
            description : string,
            superadmin_only : 1 | 0 ,
            access_for_all : 1 | 0,
            cr_by:number,
            extra_actions:{
              action_name:string,
              action_desc:string
            }[];
          }
        >,
        res
      ) => {
        const data = req.body;
        const cr_by= req.user.user_id
        const response = await pageModel.AddPage({...data,cr_by:Number(cr_by)})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Page added successfully'))
        }else {
          res.json(new ApiResponse(400,{},"Page already exists"));
          throw new Error('Could not Add')
        }
      }
    )
  )