import { Router, Request } from 'express';
import { designation_model } from '../models/designation.models';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';

export const designationRouter = Router();


designationRouter.get(
  '/',
  asyncHandler(async (
    req: Request<
      unknown,
      unknown,
      unknown,
      { entity_id: string; name: string; limit: number,page:number }
    >,
    res
  ) => {
    const data = await designation_model.getDesignations(
      req.query.entity_id,
      req.query.name,
      req.query.limit,
      req.query.page
    );
    res.json(new ApiResponse(200 ,  data.data ,""));
  })
);

designationRouter.post('/', async (req:AuthenticatedRequest<
  unknown,
  unknown,
  {name : string},
  { entity_id: string;}
>,
res) => {
  const{entity_id}=req.query;
  const{name}=req.body;
  const data = await designation_model.addDesignation(entity_id , name , req.user.user_id)
  if(data){
    res.json(new ApiResponse(200,{},'Designation added successfully'));
  }else{
    res.json(new ApiResponse(400,{},'failed'));
  }
});

designationRouter.put('/', async (req : AuthenticatedRequest<
    unknown,
    unknown,
    {
      name : string;
      desig_id : number;
      is_active :boolean;
    },
    {
      entity_id : number;
    }
  >, res) => {
  const {name , desig_id,is_active}=req.body;
  const {entity_id}=req.query;
  const response = await designation_model.updateDesignation({entity_id , name , desig_id ,is_active, mo_by : req.user.user_id}); 
  if(response){
    res.json(new ApiResponse(200 , {} , 'Updated successfully'))
  }else {
    // throw new Error('Could not update');
    res.json(new ApiResponse(400,{},"could not update"));
  }
});
