import { Request, Response, Router } from 'express';
import { Entity } from '../models/entity.models';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';
import multer from 'multer';
const upload = multer();

export const entityRouter = Router();

interface FileMetaData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

entityRouter.get(
  '/',
  asyncHandler(
    async (
      req: Request<unknown, unknown, unknown, { entity_id: number }>,
      res: Response
    ) => {
      
      const data = await Entity.get_entity(req.query.entity_id);
      if (!data) {
        return;
      }
      res.json(new ApiResponse(200 , data.data , 'success'));
    }
  )
  
);

// entityRouter.get(
//   '/name',
//   async (
//     req: Request<unknown, unknown, unknown, { entity_id: number }>,
//     res: Response
//   ) => {
//     // const data = ;
//     res.json(await Entity.get_name(req.query.entity_id));
//   }
// );

entityRouter.post('/', asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    entity_id:number;
    name:string;
    short_desc:string;
    address:string;
    email:string;
    reg_num:string;
    estab_date:string;
    expiry_date:string;
    bank_ac_num:string;
    bank_ifsc:string;
    bank_name:string;
    bank_location:string;
    gst_no:string;
    country: string;
    state: string;
    city: string;
    area:string;//new added
    pincode: string 
    additional_info:string;
    phone_num:string | null;
    // S3 RELATED THINGS

    s3_region?:string;
    s3_access_key_id?:string;
    s3_secret_access_key?:string;
    s3_bucket_name?:string;
    s3_cloudfront_url?:string;

    // gmail things
    gmail_id : string;
    app_password : string;
  }

  >, res) => {
  const data = req.body;
  const cr_by = req.user.user_id
  const e_id = await Entity.add(data,cr_by);
  
  if(e_id){
    res.send(new ApiResponse(200 , {'entity_id' : e_id.toString()} , 'Added successfully'));
  }else{
    res.json(new ApiResponse(400 , {} , 'Failed'));
  }
  
  
  
  // for (const office_bearer of data.office_bearer) {
  //   office_bearer.entity_id = e_id;
  //   await OfficeBearerModel.add(office_bearer);
  // }
  
}));

entityRouter.put('/', 
  upload.fields([{ name: 'entity_image' }]),
  asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    data:{entity_id:number;
    name:string;
    short_desc:string;
    address:string;
    email:string;
    reg_num:string;
    estab_date:string;
    expiry_date:string;
    bank_ac_num:string;
    bank_ifsc:string;
    bank_name:string;
    bank_location:string;
    gst_no:string;
    country: string;
    state: string;
    city: string;
    area:string;//new added
    pincode: string 
    additional_info:string;
    phone_num:string | null;
    // S3 RELATED THINGS
    s3_region?:string;
    s3_access_key_id?:string;
    s3_secret_access_key?:string;
    s3_bucket_name?:string;
    s3_cloudfront_url?:string;
    }
  }>, res) => {

     const files = req.files as {entity_image?: FileMetaData[]};
    const EntityImage = files.entity_image?.[0] ?? ''
    const data = JSON.parse(String( req.body.data));
  const mo_by = req.user.user_id
  const response = await Entity.update({...data,imageFile:EntityImage},mo_by);
  if(response.result){
    res.json(new ApiResponse(200 , {} , 'Updated successfully'));
  }else {
    throw new Error('Failed')
  }
}) );

entityRouter.get(
  '/getentitybyid',
  asyncHandler(
    async (
      req: Request<
      unknown, 
      unknown, 
      unknown, 
      { 
        entity_id: number
      }>,
      res: Response
    ) => {
      
      const data = await Entity.getEntityById(req.query.entity_id);
      if (!data) {
        return;
      }
      res.json(new ApiResponse(200 , data.data , 'success'));
    }
  )
  
);
