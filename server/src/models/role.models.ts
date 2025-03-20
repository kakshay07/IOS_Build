import { ApiResponse } from "../utils/ApiResponse";
import { getConnection, query } from "../utils/db";
import logger from "../utils/logger";

interface PageAccess {
  page_id: number;
  access_to_add?: 1 | 0;
  access_to_update?: 1 | 0;
  access_to_delete?: 1 | 0;
  access_to_export?: 1 | 0;
}
interface ExtraActions{
  page_id:number;
  action_id:number;
  action_name:string;

}

export class role_access {
  entity_id?: number;
  branch_id?:number;
  role_id?: number;
  role_name?: string;
  page_access?: PageAccess[];
  extra_actions?:ExtraActions[]; // new added
  login_req?: 0 | 1;
  is_staff?: boolean;
  is_admin?: boolean;
  level?: number;
  self_all?: string;
  is_external?: 0 | 1;
  is_superadmin?: boolean;
  is_active?: boolean;
  cr_on?: string;
  cr_by?: number;
  mo_on?: number;
  mo_by?: string;

  static async getRoles(entity_id: string, user: any,role_name?:string, limit?: number ,page?: any) {
    let _query = `select
                  r.entity_id, 
                  r.role_id , r.role_name , r.is_staff, r.is_admin, r.level, r.self_all, r.is_external, r.is_superadmin ,r.login_req,r.is_active,r.cr_on,r.cr_by, e.name as entity_name
                  from roles as r
                  JOIN entity as e using (entity_id)
                  where r.entity_id = ?`;
    const _params: (string | number)[] = [entity_id];
 
    if(user && user.is_admin == 1){
      _query += ` and (r.is_admin = 1 OR r.is_staff = 1 )`
    }else if(user && user.is_staff == 1){
      _query += ` and r.is_staff = 1`
    }
    if (role_name) {
      _query += ` and  role_name like '%${role_name.toLowerCase()}%'`;
    }
    if (limit && limit != -1) {
      _query += ` limit ${Number(limit) ? Number(limit) : 15} offset ${
        Number(page) * Number(limit)
      }`;
    }
    const allRoles = await query(_query, _params);

    const _query2 = `select page_id , role_id ,access_to_add,access_to_update,access_to_delete,access_to_export,cr_on,cr_by from page_access where entity_id = ?;`;
    const _params2: (string | number)[] = [entity_id];
    const allPageAccess = await query(_query2, _params2);

    const _query3 =`select page_id , role_id ,action_id,action_name,cr_on,cr_by from page_actions_access where entity_id = ?`
    const _params3: (string | number)[] = [entity_id];
    const AccessAction = await query(_query3, _params3);

    const allRolesWithPageAccess = allRoles.data.map((role: role_access) => {
      // Mapping for page access
      const FinalpageAccess = allPageAccess.data
        .filter((p: any) => p.role_id == role.role_id)
        .map((access: any) => ({
          role_id:access.role_id,
          page_id: access.page_id,
          access_to_add: access.access_to_add,
          access_to_update: access.access_to_update,
          access_to_delete: access.access_to_delete,
          access_to_export : access.access_to_export,
          cr_by: access.cr_by,
          cr_on: access.cr_on,
        }));
    
      // Mapping for extra actions
      const extra_actions = AccessAction.data
      .filter((p: any) => p.role_id === role.role_id)
        .map((action: any) => ({
          page_id: action.page_id,
          action_id: action.action_id,
          action_name: action.action_name,
          cr_by: action.cr_by,
          cr_on: action.cr_on,
          role_id:action.role_id,
          access_to_action:1
           // Default value, modify as needed
        }));
    
      return {
        ...role,
        page_access: FinalpageAccess, // Page access data
        extra_actions, // Separate extra actions
      };
    });
    
    return { data: allRolesWithPageAccess };
    
  }

  // function to Addroles and page_access
  static async addRoles(data: role_access,entity_id:number,branch_id:number,cr_by:number) {
    try {
      const conn = await getConnection();
      const rows = await conn.query(
        `select COALESCE(max(role_id),0)+1 as role_id from roles where entity_id = ? `,
        [entity_id]
      );
      data.role_id = rows[0].role_id;
      await conn.query(
        "insert into roles (entity_id,role_id,role_name , is_superadmin , is_admin , level , self_all , is_external , is_staff , login_req , cr_by,cr_on) values (?,?,?,?,?,?,?,?,?,?,?,NOW()) ",
        [
          entity_id,
          data.role_id,
          data.role_name,
          data.is_superadmin,
          data.is_admin,
          data.level ? data.level : 0,
          data.self_all,
          data.is_external,
          data.is_staff,
          data.login_req,
          cr_by,
        ]
      );

      // for (const page of data.page_access) {
      //   const pageId = page.page_id;
      //   await conn.query(
      //     "insert into page_access (entity_id,role_id,page_id) values (?,?,?)", //access_to_add,access_to_update,access_to_delete
      //     [data.entity_id, data.role_id, pageId]
      //   );
      // }
      if (data.page_access && data.page_access.length > 0) {
        for (const page of data.page_access) {
          const pageId = page.page_id;
          const access_to_add = page.access_to_add ?? 0;
          const access_to_update = page.access_to_update ?? 0;
          const access_to_delete = page.access_to_delete ?? 0;
          const access_to_export = page.access_to_export ?? 0;

          const _page = await conn.query(
            "INSERT INTO page_access (entity_id, role_id, page_id,access_to_add,access_to_update,access_to_delete,access_to_export,cr_by,cr_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now())",
            [
              entity_id,
              data.role_id,
              pageId,
              access_to_add == 1 ? access_to_add : 0,
              access_to_update == 1 ? access_to_update : 0,
              access_to_delete == 1 ? access_to_delete : 0,
              access_to_export == 1 ? access_to_export : 0,
              cr_by
            ]
          );
        }
      } else {
        console.log("No page access data to insert.");
      }
      if(data.extra_actions && data.extra_actions.length > 0){
        const {extra_actions}=data
        for(const ExtraAcccess of extra_actions){
            const page_id=ExtraAcccess.page_id
            const action_id=ExtraAcccess.action_id
            const action_name =ExtraAcccess.action_name

           const extraAccessresponse= await conn.query(
              "INSERT INTO page_actions_access (entity_id, role_id, page_id,action_id,action_name,cr_by,cr_on) VALUES (?, ?, ?, ?, ?, ?, now())",
              [
                entity_id,
                data.role_id,
                page_id,
                action_id,
                action_name,
                cr_by
              ]
            );
        }
      }
      return data.role_id;
    } catch (e) {
      logger.error(e);
    }
  }

  static async updateRoleAccess(data: role_access) {
    try {
      const conn = await getConnection();
  
      // Update role information in roles table
      const _rows = await conn.query(
        "update roles set role_name= ? , is_admin = ? , level = ? , self_all = ? ,is_external = ? , is_superadmin =? , is_staff = ? , login_req = ?, is_active= ? , mo_by = ?, mo_on = NOW() where role_id= ? and entity_id= ? ",
        [
          data.role_name,
          Number(data.is_admin),
          data.level,
          data.self_all,
          data.is_external,
          Number(data.is_superadmin),
          Number(data.is_staff),
          data.login_req,
          data.is_active,
          Number(data.mo_by),
          data.role_id,
          data.entity_id,
        ]
      );
  
      // Handle page access updates
      if (data.page_access && data.page_access?.length > 0) {
        // First, delete existing page access records
        await conn.query("DELETE FROM page_access WHERE role_id=? AND entity_id=?", [
          data.role_id,
          data.entity_id,
        ]);
  
        // Insert new page access records
        const pageAccessUpdate = [];
        for (const page of data.page_access) {
          const pageId = page.page_id;
          const { access_to_add, access_to_delete, access_to_update,access_to_export } = page;
  
          const _update = await conn.query(
            "INSERT INTO page_access (entity_id, role_id, page_id, access_to_add, access_to_update, access_to_delete, access_to_export, cr_on, cr_by, mo_by, mo_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())",
            [
              data.entity_id,
              data.role_id,
              pageId,
              access_to_add == 1 ? access_to_add : 0,
              access_to_update == 1 ? access_to_update : 0,
              access_to_delete == 1 ? access_to_delete : 0,
              access_to_export == 1 ? access_to_export : 0,
              data.cr_on,
              data.cr_by,
              data.mo_by,
            ]
          );
          pageAccessUpdate.push(_update);
        }
  
        if (pageAccessUpdate[pageAccessUpdate.length - 1]) {
          console.log("Page access updated successfully.");
        }
      } else {
        await conn.query(
          "DELETE FROM page_access WHERE role_id=? And entity_id=?",
          [data.role_id, data.entity_id]
        );
      }
  
      // Handle page access actions updates (DELETE and INSERT)
      if (data.extra_actions && data.extra_actions.length > 0) {
        await conn.query("DELETE FROM page_actions_access WHERE role_id=? AND entity_id=?", [
          data.role_id,
          data.entity_id,
        ]);
  
        // Insert new page access actions records
        const actionUpdate = [];
        for (const action of data.extra_actions) {
          const { page_id, action_id, action_name } = action;
  
          const _updateAction = await conn.query(
            "INSERT INTO page_actions_access (entity_id, role_id, page_id, action_id, action_name, cr_on, cr_by, mo_by, mo_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now())",
            [
              data.entity_id,
              data.role_id,
              page_id,
              action_id,
              action_name,
              data.cr_on,
              data.cr_by,
              data.mo_by,
            ]
          );
          actionUpdate.push(_updateAction);
        }
  
        if (actionUpdate[actionUpdate.length - 1]) {
          console.log("Page access actions updated successfully.");
        }
      } else {
        await conn.query("DELETE FROM page_actions_access WHERE role_id=? AND entity_id=?", [
          data.role_id,
          data.entity_id,
        ]);
      }
      return new ApiResponse(200, {}, "Role access and actions updated.");
    } catch (error) {
      console.error("Error while updating role access:", error);
      throw new Error("Error while updating role access");
    }
  }
  
}
