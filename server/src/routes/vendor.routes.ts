import {Router,Request,Response} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { vendorModel } from "../models/vendor.models";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";
import { ApiResponse } from "../utils/ApiResponse";

export const vendorRouter = Router();


vendorRouter.get(
    '/',
    asyncHandler(
        async (
        req:Request<
          unknown,
          unknown,
          unknown,
          { 
            entity_id: number;
            branch_id: number;
            vendor_id: string;
            type: string;
            page: number;
            limit: number;
          }
        >,
        res: Response
      ) => {
        const {entity_id, branch_id, vendor_id, type, page, limit} = req.query;
        const data = await vendorModel.GetAllVendor(
          entity_id, branch_id, vendor_id, type, page, limit
        );
        if (!data) {
            return;
          }
        res.json(new ApiResponse(200 , data.data));
      }
    )
    
  );

vendorRouter.post(
  "/",
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          name: string;
          type: string;
          is_outsource: 0 | 1;// added on 12-08
          address_1: string;
          phone: string;
          email: string;
          country: string;
          state: string;
          city: string;
          area:string //NEW ADDED
          pincode: string;
          reg_num:string;
          gst_num:string;
          poc_name:string;
          poc_phone:number;
          bank_name:string;
          bank_acc_num:string;
          bank_acc_type:string;
          bank_branch_name:string;
          is_active:string;
          cr_by:string;
        },
        { entity_id: number; branch_id: number }
      >,
      res
    ) => {
        const {entity_id,branch_id}=req.query;
        const {name,type,address_1,phone,email,country,state,city,area,pincode,reg_num,gst_num,poc_name,poc_phone,bank_name,bank_acc_num,bank_acc_type,bank_branch_name,is_active,is_outsource}=req.body;
      const data = await vendorModel.AddVendor({entity_id,branch_id,name,type,address_1,phone,email,country,state,city,area,pincode,cr_by:req.user.user_id,reg_num,gst_num,poc_name,poc_phone,bank_name,bank_acc_num,bank_acc_type,bank_branch_name,is_active,is_outsource});
      if(data){
        res.json(new ApiResponse(200 , {},"vendor added successfully"))
      }else {
        throw new Error('Cannot add try Again!');
      }
    }
  )
);

vendorRouter.put(
    "/",
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            vendor_id:number;
            name: string;
            type: string;
            is_outsource: 0 | 1;
            address_1: string;
            phone: string;
            email: string;
            country: string;
            state: string;
            city: string;
            area:string;
            pincode: string;
            reg_num:string;
            gst_num:string;
            poc_name:string;
            poc_phone:number;
            bank_name:string;
            bank_acc_num:string;
            bank_acc_type:string;
            bank_branch_name:string;
            is_active:string;
            mo_by:string;
          },
          { entity_id: number; branch_id: number }
        >,
        res
      ) => {
          const {entity_id,branch_id}=req.query;
          const  {vendor_id,name,type,is_outsource,address_1,phone,email,country,state,city,area,pincode,reg_num,gst_num,poc_name,poc_phone,bank_name,bank_acc_num,bank_acc_type,bank_branch_name,is_active}=req.body;
          const data = {
            vendor_id,
            name,
            type,
            is_outsource,
            address_1,
            phone,
            email,
            country,
            state,
            city,
            area,
            pincode,
            reg_num,
            gst_num,
            poc_name,
            poc_phone,
            bank_name,
            bank_acc_num,
            bank_acc_type,
            bank_branch_name,
            is_active,
            mo_by:req.user.user_id,
          };
        //const data = await vendorModel.UpdateVendor({entity_id,branch_id,vendor_id,name,type,address_1,phone,email,country,state,city,pincode,reg_num,gst_num,point_of_contact,bank_name,bank_acc_num,bank_acc_type,bank_branch_name,is_active,mo_by:req.user.user_id});
          const _data=await vendorModel.UpdateVendor({...data,entity_id,branch_id})
        if(_data){
          res.json(new ApiResponse(200 , {},"Vendor updated successfully"))
        }else {
          throw new Error('Cannot add try Again!')
        }
      }
    )
  );
  