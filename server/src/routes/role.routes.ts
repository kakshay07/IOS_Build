import { Router } from 'express';
import { role_access } from '../models/role.models';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';

export const roleAccessRouter = Router();

roleAccessRouter.get(
  '/',
  async (
    req: AuthenticatedRequest<
      unknown,
      unknown,
      unknown,
      { entity_id: string; role_name: string; limit: number ,page:number}
    >,
    res
  ) => {
    const data = await role_access.getRoles(
      req.query.entity_id,
      req.user,
      req.query.role_name,
      req.query.limit,
      req.query.page
    );
    res.json(new ApiResponse(200 ,  data.data ,""));
  }
);

roleAccessRouter.post(
  '/',
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          role_name: string;
          page_acces:{
            page_id: number;
            access_to_add?: 1 | 0;
            access_to_update?: 1 | 0;
            access_to_delete?: 1 | 0;
            access_to_export?: 1 | 0;
          } [];
          extra_actions:{
            page_id:number,
            action_id:number,
            action_name:string,
          }[]
          is_admin: boolean;
          level: number;
          self_all: string;
          is_external: 0 | 1;
          is_staff: boolean;
          is_superadmin: boolean;
          login_req : 0 | 1
          cr_by:number;
        },
        { entity_id: number; branch_id: number }
      >,
      res
    ) => {
      const data = req.body;
      const {entity_id,branch_id} = req.query
      const response = await role_access.addRoles(
        data,
        entity_id,
        branch_id,
        Number(req.user.user_id)
      );
      if (response) {
        res.json(new ApiResponse(200, {}, 'Roles added successfully'));
      } else {
        res.json(new ApiResponse(400, {}, 'Failed to add roles'));
      }
    }
  )
);


roleAccessRouter.put(
  '/',
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          role_id: number;
          role_name: string;
          page_access: {
            page_id: number;
            access_to_add?: 1 | 0;
            access_to_update?: 1 | 0;
            access_to_delete?: 1 | 0;
            access_to_export?: 1 | 0;
          }[];
          extra_actions:{
            page_id:number,
            action_id:number,
            action_name:string,
          }[]
          is_admin: boolean;
          level: number;
          self_all: string;
          is_external: 0 | 1;
          is_staff: boolean;
          is_superadmin: boolean;
          login_req : 0 | 1
          is_active:boolean;
          cr_by:number,
          cr_on:string,
          mo_by?: number;
        },
        { entity_id: string; branch_id: string }
      >,
      res
    ) => {
      const { role_name, role_id, page_access,extra_actions, is_admin, level, self_all, is_external, is_superadmin, is_staff, login_req ,is_active,cr_by,cr_on } = req.body;
      const { entity_id } = req.query;
      if (!entity_id) {
        return res.status(400).json({ message: 'Entity ID is required' });
      }
      const mo_by = req.user.user_id
      const response = await role_access.updateRoleAccess({
        entity_id: Number(entity_id),  // Ensure entity_id is passed as a number
        role_name,
        role_id,
        page_access,
        extra_actions, 
        is_admin,
        level,
        self_all,
        is_external,
        is_superadmin,
        is_staff,
        login_req ,
        is_active,
        cr_by,
        cr_on,
        mo_by,
      });
      if (response) {
        res.json(new ApiResponse(200, {}, 'Updated successfully'));
      } else {
        res.status(400).json(new ApiResponse(400, {}, 'Could not update role access'));      }
    }
  )
);
