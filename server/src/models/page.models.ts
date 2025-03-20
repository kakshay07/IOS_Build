import { getId, insertTable, query, updateTable } from "../utils/db";

class ExtraActions {
  action_name: string | null = null;
  action_desc: string | null = null;
  action_id?: string | null = null;
}

export class pageModel {
    page_id ?: string;
    page_name ?: string;
    superadmin_only?: 0 | 1;
    extra_actions: ExtraActions[] = [];
    cr_by?:number;
    cr_on?:string;
    mo_by?:number;
    mo_on?:string;

    static async getAllPages(is_superadmin:0|1) {
      // Query pages
      let pagesQuery = `
          SELECT 
              page_id, 
              page_name, 
              name, 
              description, 
              superadmin_only, 
              access_for_all 
          FROM 
              pages`;

              if(is_superadmin == 0){
                pagesQuery += ` where superadmin_only = 0;`
              }
     
      const pagesResult = await query(pagesQuery, [is_superadmin]);
  
      // Query actions
      const actionsQuery = `
          SELECT 
              page_id, 
              action_name, 
              action_desc 
          FROM 
              page_actions;
      `;
      const actionsResult = await query(actionsQuery, []);
  
      if (!pagesResult.result || !actionsResult.result) {
          return [];
      }
  
      const pages = pagesResult.data;
      const actions = actionsResult.data;
  
      const actionsByPageId = actions.reduce((acc:any, action:any) => {
          const { page_id, action_name, action_desc } = action;
          if (!acc[page_id]) {
              acc[page_id] = [];
          }
          acc[page_id].push({ action_name, action_desc });
          return acc;
      }, {});
  
      const combinedResult = pages.map((page:any) => ({
          ...page,
          extra_actions: actionsByPageId[page.page_id] || [], 
      }));
  
      return combinedResult;
  }
  

    static async getAllPages_Except_accessForAll(data : {
      entity_id : number ,
      role_id : number ,
      is_superadmin ?: 1 | 0
    }) {
      let _query = `Select 
      p.page_id , 
      p.page_name , 
      p.name,
      p.description,
      p.superadmin_only, 
      p.access_for_all,
      pa.access_to_add,
      pa.access_to_update,
      pa.access_to_delete,
      pa.access_to_export
      from pages p
      join page_access pa on pa.entity_id = ${data.entity_id} and pa.role_id = ${data.role_id} and  p.page_id = pa.page_id 
      where 
      p.superadmin_only = 0 and 
      p.access_for_all = 0`

      if(data.is_superadmin == 1){
        _query = `Select 
        p.* ,
        1 as access_to_add, 
        1 as access_to_update, 
        1 as access_to_delete,
        1 as access_to_export
        from pages p
        where 
        superadmin_only = 0`
      }

      const allPages = await query(_query , []);
      let actionsQuery = `
      SELECT 
          pa.page_id,
          pa.action_id, 
          pa.action_name, 
          pa.action_desc 
      FROM 
          page_actions pa
      join page_actions_access paa 
      on pa.page_id=paa.page_id and pa.action_id=paa.action_id
      where paa.entity_id=${data.entity_id} and paa.role_id=${data.role_id}
  `;
        if(data.is_superadmin == 1){
        actionsQuery = `
        SELECT 
            pa.page_id,
            pa.action_id, 
            pa.action_name, 
            pa.action_desc 
        FROM 
            page_actions pa`
        }
            
     const actionsResult = await query(actionsQuery, []);
     const actions = actionsResult.data;

     const actionsByPageId = actions.reduce((acc:any, action:any) => {
        const { page_id,action_id, action_name, action_desc } = action;
        if (!acc[page_id]) {
            acc[page_id] = [];
        }
        acc[page_id].push({ action_id,action_name, action_desc });
        return acc;
    }, {});
    const combinedResult = allPages.data.map((page:any) => ({
        ...page,
        extra_actions: actionsByPageId[page.page_id] || [], 
    }));
          return combinedResult;
    //   return;
    }

    static async updatePage(data: {
      page_id: number;
      page_name: string;
      name: string;
      description: string;
      superadmin_only: 1 | 0;
      access_for_all: 1 | 0;
      mo_by: number;
      extra_actions: {
          action_name: string;
          action_desc: string;
      }[];
  }) {
      try {
          const delQuery = `DELETE FROM page_actions WHERE page_id = ${data.page_id}`;
          const deleteResult = await query(delQuery);
          if (!deleteResult.result) {
              console.error("Failed to delete existing actions");
              return false;
          }
          const response = await updateTable({
              table: 'pages',
              data: {
                  page_name: data.page_name,
                  name: data.name,
                  description: data.description,
                  superadmin_only: data.superadmin_only,
                  access_for_all: data.access_for_all,
                  mo_by: data.mo_by,
              },
              where: {
                  page_id: data.page_id,
              },
          });
          if (!response.result) {
              console.error("Failed to update the page");
              return false;
          }
          // Insert new actions if any
          if (data.extra_actions.length > 0) {
              for (const action of data.extra_actions) {
                  const { data: actionId } = await getId({
                      table: 'page_actions',
                      column: 'action_id',
                      where: {},
                  });
  
                  const actionResponse = await insertTable({
                      table: 'page_actions',
                      data: { ...action, action_id: actionId[0].action_id, page_id: data.page_id ,mo_by:data.mo_by },
                  });
  
                  if (!actionResponse.result) {
                      console.error("Failed to insert an action", action);
                      return false; // Stop if any action fails to insert
                  }
              }
          }
          return true;
      } catch (error) {
          console.error("An error occurred during updatePage:", error);
          return false; 
      }
  }
  

    static async AddPage(data: {
      page_name: string;
      name: string;
      description: string;
      superadmin_only: 1 | 0;
      access_for_all: 1 | 0;
      extra_actions: {
        action_name: string;
        action_desc: string;
      }[];
      cr_by: number;
  }) {
      try {
          // Check if the page already exists
          const _query = `SELECT COUNT(*) AS count FROM pages WHERE page_name = '${data.page_name.trim()}'`;
          const cons = await query(_query);
  
          if (cons.data[0]?.count > 0) {
              return { success: false, message: "Page already exists" };
          }
  
          // Get new page_id
          const { data: pageId } = await getId({
              table: 'pages',
              column: 'page_id',
              where: {},
          });
  
          const { extra_actions, ...dataToInsert } = data;
  
          // Insert into pages table
          const response = await insertTable({
              table: 'pages',
              data: { ...dataToInsert, page_id: pageId[0].page_id },
          });
  
          if (!response.result) {
              return { success: false, message: "Failed to insert page" };
          }
  
          // Insert into page_actions if any
          if (extra_actions.length > 0) {
              for (const action of extra_actions) {
                  const { data: actionId } = await getId({
                      table: 'page_actions',
                      column: 'action_id',
                      where: {},
                  });
  
                  const actionResponse = await insertTable({
                      table: 'page_actions',
                      data: { ...action, action_id: actionId[0].action_id, page_id: pageId[0].page_id,cr_by:data.cr_by },
                  });
  
                  if (!actionResponse.result) {
                      return { success: false, message: "Failed to insert page actions" };
                  }
              }
          }
  
          return { success: true, message: "Page added successfully" };
      } catch (error) {
          console.error("Error in AddPage:", error);
          return { success: false, message: "An unexpected error occurred" };
      }
  }
  

}