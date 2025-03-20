import {Router,Request,Response} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { eventModel } from "../models/event.model";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";
import { ApiResponse } from "../utils/ApiResponse";

export const eventRouter = Router();

eventRouter.get(
    '/',
    asyncHandler(
        async (
            req:Request<
            unknown,
            unknown,
            unknown,
            {
                entity_id: number;
                user_id: string;
                from_date: string;
                to_date: string;
            }
            >,
            res: Response
        ) => {
            const {entity_id, user_id, from_date, to_date} = req.query;
            const data = await eventModel.getEventLogs(entity_id, user_id, from_date, to_date);
            if (!data) {
                return;
            }
            res.json(new ApiResponse(200, data.data));
        }
    )
);

eventRouter.post(
    '/',
    asyncHandler(
        async (
            req:Request<
            unknown,
            unknown,
            {
                entity_id: number;
                user_id: string;
                emp_id: number;
                address: string;
            },
            unknown
            >,
            res: Response
        ) => {
            const {entity_id, user_id, emp_id, address} = req.body;
            const data = await eventModel.addEmpLoginLog(entity_id, user_id, emp_id, address);
            if (!data) {
                return;
            }
            res.json(new ApiResponse(200, data));
        }
    )
);

eventRouter.get(
    '/userdetails',
    asyncHandler(
        async (
            req:Request<
            unknown,
            unknown,
            unknown,
            {
                entity_id: number;
                user_id: string;
            }
            >,
            res: Response
        ) => {
            const {entity_id, user_id} = req.query;
            const data = await eventModel.getUserDetails(entity_id, user_id);
            if (!data) {
                return;
            }
            res.json(new ApiResponse(200, data.data));
        }
    )
);