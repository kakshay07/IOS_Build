import { Router, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler";
import {  AdditionalFeatureModel } from "../models/additionalfeature.model";
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';
import { log } from 'console';




export const additionfeatureRouter = Router()


additionfeatureRouter.get('/',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            unknown>,
            res:Response
        ) => {
            const data = await AdditionalFeatureModel.getAllAdditionalFeature()
            console.log(data,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            res.json(new ApiResponse(200, data?.data))
        }
    )
)

additionfeatureRouter.post('/',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            {feature_name:string,feature_type:string,is_active:number}
            >,
            res:Response
        ) => {
            const {feature_name,feature_type,is_active} = req.body
            const cr_by = req.user.user_id
            console.log(cr_by,">>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
            const data = await AdditionalFeatureModel.addAdditionalFeature(feature_name,feature_type,is_active,cr_by)
            if(data) {
                res.json(new ApiResponse(200 ,{},"Added successfully"))
            }
        }
    )
)

additionfeatureRouter.put('/',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            {feature_name:string,is_active:number}
            >,
            res
        ) => {
            const {feature_name,is_active} = req.body
            const mo_by = req.user.user_id
            const data = await AdditionalFeatureModel.updateAdditionalFeature(feature_name,is_active,mo_by)
            if(data){
                res.json(new ApiResponse(200,{},"Updated Successfully"))
            }
        }
    )
)


additionfeatureRouter.post('/giveAccessToEntity',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            {
                features :AdditionalFeatureModel[],
                entity_id : number,
            }
            >,
            res
        ) => {
            const {features,entity_id} = req.body
            const cr_by = req.user.user_id
            await AdditionalFeatureModel.giveAccessToEntity({
                features,
                entity_id,
                cr_by
            })
            res.json(new ApiResponse(200,{},"Access Updated Successfully"));
        }
    )
)


additionfeatureRouter.get('/getEntityAccess',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            unknown,
            {
                entity_id_ : number,
            }
            >,
            res
        ) => {
            const {entity_id_} = req.query
            const data = await AdditionalFeatureModel.getAccessOfEntity({
                entity_id : entity_id_,
            })
            res.json(new ApiResponse(200,data, 'Additional Features Updated'));
        }
    )
)


additionfeatureRouter.put('/updateFeatureTemplate',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            {
                feature_name:string,
                template_subject:string,
                template_body:string,
                entity_id:number,
            }
            >,
            res
        ) => {
            const feature = req.body
            const data = await AdditionalFeatureModel.updateAdditionalFeaturesTemplate(feature)
            res.json(new ApiResponse(200,{},"Updated Successfully"))
        }
    )
)


additionfeatureRouter.post('/sendTestEmail',
    asyncHandler(
        async(
            req:AuthenticatedRequest<
            unknown,
            unknown,
            {
                to_email:string,
                entity_id:number,
            }
            >,
            res
        ) => {
            const {to_email , entity_id} = req.body;
            await AdditionalFeatureModel.sendTestEmail({
                to_email,
                entity_id,
            })
            res.json(new ApiResponse(200,{},"Email sent successfully"))
        }
    )
)