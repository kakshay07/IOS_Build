import { S3Client ,DeleteObjectCommand} from '@aws-sdk/client-s3';
import { generateToken } from '../middlewares/auth.middlewares';
import { comparePassword, getCurrentDate, getPasswordHash, getRandomNumber } from '../utils';
import { ApiError } from '../utils/ApiError';
import { getConnection, getId, query } from '../utils/db';
import logger from '../utils/logger';
import { Upload } from '@aws-sdk/lib-storage';
import { Entity } from './entity.models';
import notificationModel from './notification.models';


interface FileMetaData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface Session {
  token: string;
  entity_id:number
  log_type: string;
  session_id: number;
  login_time: Date;
  logout_time: Date | null;
}
export class User {
  entity_id?: number;
  branch_id ?:number;
  user_id?: number;
  role_id?: number;
  user_name?: string;
  user_password: string | null = null;
  full_name?: string;
  email_id?: string;
  contact_no?: string;
  user_active?: string;
  desig_id? : number;
  cr_on?: string;
  cr_by?: number;
  mo_on?: string;
  mo_by?: number;
  imageFile?:FileMetaData | null = null;
  

  static async changePassword(data: {
    entity_id: number;
    user_name: string;
    user_password: string;
    branch_id : number;
  }) {
    const conn = await getConnection();
    const hashpassword =  await getPasswordHash(data.user_password);
    data.user_password = hashpassword
    const response= await conn.query(
      `update users set user_password = ? where user_name = ? and entity_id = ? and branch_id = ?`,
      [data.user_password, data.user_name , data.entity_id , data.branch_id ]
    
    );
    if(response.affectedRows > 0){
      return true;
    }else {
      return false
    }
  }

  static async checkSession(data: { user_name: string}) {
    try {
        const conn = await getConnection();
        
        // Query to check for an active session
        const [user] = await conn.query('SELECT u.entity_id,u.user_name,u.user_id FROM users u join roles using (entity_id,role_id) WHERE Binary user_name = ?', [data.user_name]);
      
        const session:Session[] = await conn.query(
            `SELECT session.token, session.log_type, session.session_id, session.login_time, session.logout_time,session.entity_id
             FROM session
             JOIN users ON session.user_id = users.user_id and session.entity_id=users.entity_id
             WHERE users.user_name = ? AND users.entity_id= ? and  session.logout_time IS NULL`, 
            [data.user_name,user.entity_id]
        );
        //new Added 30-08-2024
        const currentDate = new Date();
        const loginDate = new Date(session[0].login_time);
        if (
          currentDate.getDate() !== loginDate.getDate() ||
          currentDate.getMonth() !== loginDate.getMonth() ||
          currentDate.getFullYear() !== loginDate.getFullYear()
        ) {
            await conn.query(`
            UPDATE session
            SET log_type = 'LO', logout_time = NOW() 
            WHERE user_id = ? AND log_type = 'LI' AND entity_id=? and  logout_time IS NULL
        `, [user.user_id,user.entity_id]);
           return false;
          }
        const activeSession = session.find(session => session.log_type === 'LI' && session.token );

        if (activeSession) {
            return true;
        }
        
        return false;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

  static async forceLogout (data:{user_name:string;}){
    try{
    const conn = await getConnection();
    const [user] = await conn.query('SELECT u.entity_id,u.user_name,u.user_id FROM users u join roles using (entity_id,role_id) WHERE Binary user_name = ?', [data.user_name]);

    await notificationModel.unsubscriobeUser({entity_id: user.entity_id, user_id: user.user_id});

   return  await conn.query(`
      UPDATE session
      SET log_type = 'LO', logout_time = NOW() 
      WHERE user_id = ? AND log_type = 'LI' AND entity_id=? and  logout_time IS NULL
  `, [user.user_id,user.entity_id]);
    }
    catch(error){
     logger.error(error);
    //  throw new Error('Database query failed');
    }

  }

  static async Logout (data:{user_name:string;entity_id:number}){
    try{
    const conn = await getConnection();
    const [user] = await conn.query('SELECT entity_id, user_id FROM users WHERE Binary user_name = ?', [data.user_name]);

    await notificationModel.unsubscriobeUser({entity_id: user.entity_id, user_id: user.user_id});

   return  await conn.query(`
      UPDATE session
      SET log_type = 'LO', logout_time = NOW() 
      WHERE user_id = ? AND log_type = 'LI' AND entity_id= ?;
  `, [user.user_id,data.entity_id]);
    }
    catch(error){
     logger.error(error);
    //  throw new Error('Database query failed')
    }

  }

  static async getUserByEntityAndBranch(
    entity_id: string,
    branch_id?: number,
    user_name?: string,
    page?: number,
    limit?: number,
    role_id?:number,
    user?: any
  ) {
    let _query = `select u.* , b.name as branch_name , 
    r.role_name , 
    r.is_admin , 
    r.is_superadmin , 
    r.is_staff , 
    r.login_req,
    d.name as desig_name
    from users as u 
    JOIN branch as b
    using (entity_id , branch_id)
    JOIN roles as r 
    using (entity_id , role_id)
    JOIN designation as d
    using (entity_id , desig_id)
    where entity_id = ? and branch_id = ? `;

    const _params = [entity_id , branch_id];
    if (user_name) {
      _query += ` and user_name like '${user_name}%' `;
    }
    if(role_id){
      _query += ` and role_id = ?`;
      _params.push(role_id); 
    }
    if(user && user.is_admin == 1){
      _query += ` and (r.is_admin = 1 OR r.is_staff = 1)`
    }else if(user && user.is_staff == 1){
      _query += ` and r.is_staff = 1`
    }
 

    _query +=  ` order by user_id`
  //   if (name) {
  //     _query += ` and lower(full_name) like '%${name.toLowerCase()}%'`;
  //   }
    if(limit && limit != -1) {
      _query += ` limit ${Number(limit) ? Number(limit) :15} offset ${Number(page) * Number(limit)}`;
  }
    return await query(_query, _params);
  }
 
  static async login(data: {
    // entity_id: string;
    // event_id: string;
    user_name: string;
    password: string;
  }) {
      const conn = await getConnection();
      const [user] = await conn.query(`select u.entity_id, u.user_id, u.user_name, u.user_password, u.role_id, u.full_name, u.user_active, u.branch_id, u.desig_id,u.imageFile, r.role_name, r.is_superadmin, r.is_admin, r.is_staff, r.is_active, r.self_all, r.is_external, r.level, e.additional_info,e.s3_cloudfront_url,e.imageFile as entityImage, DATE_FORMAT(e.expiry_date, '%Y-%m-%d') AS expiry_date from users u join roles r using (entity_id,role_id) join entity e using (entity_id) where Binary user_name = ?`, [data.user_name]);
      if (user) {
          if (!user.is_superadmin) {
            if (
              user.expiry_date == null ||
              user.expiry_date < getCurrentDate()
            ) {
              return { msg: "Subscription expired! Please contact the admin" };
            }
          }
        
        const passwordMatch = await comparePassword(data.password, user.user_password);
        if (passwordMatch) {
          if (!user.user_active || !user.is_active) {
            return { msg: 'User/Role is disabled' };
          } else {
            const token = generateToken({
              "entity_id": user.entity_id,
              "user_name": user.user_name,
              "full_name": user.full_name,
              "role_name": user.role_name,
              "role_id": user.role_id,
              "is_superadmin": user.is_superadmin,
              "is_admin": user.is_admin,
              "is_staff": user.is_staff,
              "user_id" : user.user_id,
              "desig_id" : user.desig_id,
              "self_all" : user.self_all,
              "level" : user.level,//not required
              "is_external": user.is_external// not required
            });
            
            await conn.query(`insert into session (entity_id,user_id,token,log_type,login_time)Values( ?,?,?,?,Now())`,[user.entity_id,user.user_id,token,'LI'])
            // if(user.is_admin){
            //   const pages = await conn.query("select * from pages where superadmin_only = 0");
            //   const branches = await conn.query("select branch_id , name from branch where entity_id = ?" , [user.entity_id]);
            //   const pageAccess = [];
            //   for (const page of pages) {
            //     pageAccess.push({
            //       url : page.page_name,
            //       access_to_add : 1,
            //       access_to_update : 1,
            //       access_to_delete : 1
            //     })
            //   }

            // return { user, token , pageAccess , branchAccess : branches};
              
            // }else 
            if(user.is_superadmin){
              const pages = await conn.query("select * from pages");
              const pageAccessActionsForSuperAdmin=await conn.query("select action_id,page_id,action_desc,action_name from  page_actions");
              const branches = await conn.query("select branch_id , name ,is_active from branch where entity_id = ?" , [user.entity_id]);
              const pageAccess = [];
              for (const page of pages) {
                // Find matching actions for the current page
                const matchingActions = pageAccessActionsForSuperAdmin.filter((action:{action_id:number,page_id:number})=> action.page_id == page.page_id);
                const pageEntry = {
                  url: page.page_name,
                  access_to_add: 1,
                  access_to_update: 1,
                  access_to_delete: 1,
                  access_to_export : 1,
                  extra_actions: [] as { action_id: number; action_name: string; action_desc: string }[] // Add this field to store matching actions
                };
              
                // Add matching actions to the extra_actions array
                for (const action of matchingActions) {
                  pageEntry.extra_actions.push({
                    action_id: action.action_id,
                    action_name: action.action_name,
                    action_desc: action.action_desc,
                  });
                }
                pageAccess.push(pageEntry);
              }
            return { user, token , pageAccess , branchAccess : branches};
            } else{
              const _page_query = `
              select 
                PA.page_id,
                P.page_name as url, 
                PA.access_to_add, 
                PA.access_to_update, 
                PA.access_to_delete,
                PA.access_to_export
              from 
                page_access PA 
              join pages P on P.page_id = PA.page_id 
              where 
                PA.entity_id = ? and PA.role_id = ? 
              union all
              select 
               Null as page_id,
                page_name as url, 
                1 as access_to_add, 
                1 as access_to_update, 
                1 as access_to_delete,
                1 as access_to_export
              from 
                pages 
              where 
                superadmin_only = 0 and access_for_all = 1;
            `
              const pageAccess = await conn.query(_page_query , [user.entity_id , user.role_id]);
              // IF ANY PAGE ACTIONS ACCESS
              const pageActionsQuery = `SELECT 
                                pc.page_id, 
                                pc.action_id, 
                                pa.action_name, 
                                pa.action_desc 
                            FROM 
                                page_actions_access pc
                            LEFT JOIN 
                                page_actions pa ON pa.page_id = pc.page_id AND pa.action_id = pc.action_id
                            WHERE 
                                pc.entity_id = ? AND pc.role_id = ?
                      `;
                        const pageActionsAccess = await conn.query(pageActionsQuery, [
                          user.entity_id,
                          user.role_id,
                        ]);
                        const mergedPageAccess = pageAccess.map((page:any) => {
                          const pageActions = pageActionsAccess
                            .filter((action:any) => action.page_id == page.page_id) // Match by `page_id`
                            .map(({ page_id,action_id, action_name, action_desc }:any) => ({
                              page_id,
                              action_id,
                              action_name,
                              action_desc,
                            }));
                        
                          return {
                            ...page,
                            extra_actions: pageActions, // Add the matching actions as `extra_actions`
                          };
                        });
              return { user, token ,pageAccess:mergedPageAccess , branchAccess : [] };
            }
            
          }
        } else {
          return { msg: 'Invalid Username or Password' };
        }
      } else {
        return { msg: 'Invalid Username or Password' };
      }
    }
  
  static async addUser(data: User) {

    //Getting all S3 details
    const getEntity = await Entity.getEntityById(data.entity_id);
    const ent = getEntity.data[0];        
    if (
        (ent.s3_region == null || ent.s3_region == '') ||
        (ent.s3_access_key_id == null || ent.s3_access_key_id == '') ||
        (ent.s3_secret_access_key == null || ent.s3_secret_access_key == '') ||
        (ent.s3_bucket_name == null || ent.s3_bucket_name == '') ||
        (ent.s3_cloudfront_url == null || ent.s3_cloudfront_url == '')
    ) {
        throw new ApiError(400, 'Add S3 configuration details');
    }


    const s3Client = new S3Client({
      region: ent.s3_region,
      credentials: {
        accessKeyId: ent.s3_access_key_id,
        secretAccessKey: ent.s3_secret_access_key,
      },
    });

  // Helper function to upload a file
  const uploadFile = async (file: any) => {

      const fileParts = file.originalname.split('.');
      const fileExtension = fileParts.pop();
      const timestamp = `${new Date().getTime()}_${getRandomNumber(100000, 1000000)}`;
      const uniqueFileName = `${data.entity_id}/${data.branch_id}/Profile/${timestamp}.${fileExtension}`;

      const upload = new Upload({
      client: s3Client,
      params: {
          Bucket: ent.s3_bucket_name,
          Key: uniqueFileName,
          Body: file.buffer,
          ContentType: file.mimetype, // Sets correct file type
      },
      });

      try {
          const data = await upload.done();
          return data;
      } catch (err) {
          console.error('Error uploading file:', err);
          throw new Error(`Error uploading file ${file.originalname}: ${err}`);
      }
  };

  const uploadPromises = [];
  if (data.imageFile) uploadPromises.push(uploadFile(data.imageFile));

  const results = await Promise.all(uploadPromises);
    //  data.imageFile=results[0]?.Key
    const roleNameData = await query(`select role_name from roles where entity_id=${data.entity_id} and role_id=${data.role_id}`) 
    try {
      const { data: user_id } = await getId({
        table: 'users',
        column: 'user_id',
        where: { entity_id: data.entity_id },
      });
      if (!user_id) return;
      if(data.user_name == null || data.user_name ==''){
        data.user_name = `${data.entity_id}-${roleNameData.data[0].role_name}-${user_id[0].user_id}`
      }
      // if (!data.user_password) return;
      const hashpassword =  await getPasswordHash(String(data.user_password));
      data.user_password = hashpassword
      data.user_id = user_id[0].user_id;

      const _query=`INSERT INTO users (entity_id,branch_id,user_id,user_name,user_password,role_id,full_name,imageFile,desig_id,cr_by,cr_on)
                    VALUES( ? ,? ,?,?,?,?,?,?,?,?,Now())`
      const insertResponse=await query(_query,[data.entity_id,data.branch_id,data.user_id,data.user_name,data.user_password,data.role_id,data.full_name,results[0]?.Key,data.desig_id,data.cr_by]);
      if(insertResponse.result){
        return true;
      }
      return;
    } catch (e:any) {
      throw new ApiError(400,e.message)
    }
  }

  static async updateUser(data: User) {

    //Getting all S3 details
    const getEntity = await Entity.getEntityById(data.entity_id);
    const ent = getEntity.data[0];        
    if (
        (ent.s3_region == null || ent.s3_region == '') ||
        (ent.s3_access_key_id == null || ent.s3_access_key_id == '') ||
        (ent.s3_secret_access_key == null || ent.s3_secret_access_key == '') ||
        (ent.s3_bucket_name == null || ent.s3_bucket_name == '') ||
        (ent.s3_cloudfront_url == null || ent.s3_cloudfront_url == '')
    ) {
        throw new ApiError(400, 'Add S3 configuration details');
    }

    const query1 = `SELECT imageFile FROM users WHERE entity_id = ${data.entity_id} AND branch_id = ${data.branch_id} AND user_id = ${data.user_id}`;
    const result = await query(query1);
    
    let imageFileKey = result.data[0]?.imageFile; // Default to existing imageFile
    
    if (data.imageFile) {
        // Initialize S3 client
        const s3Client = new S3Client({
          region: ent.s3_region,
          credentials: {
            accessKeyId: ent.s3_access_key_id,
            secretAccessKey: ent.s3_secret_access_key,
          },
        });
    
        // Delete the existing file if present
        if (imageFileKey) {
            const deleteParams = {
                Bucket: ent.s3_bucket_name,
                Key: imageFileKey,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
        }
    
        // Upload the new file
        const uploadFile = async (file: any) => {
          
          const fileParts = file.originalname.split('.');
          const fileExtension = fileParts.pop();
          const timestamp = `${new Date().getTime()}_${getRandomNumber(100000, 1000000)}`;
          const uniqueFileName = `${data.entity_id}/${data.branch_id}/Profile/${timestamp}.${fileExtension}`;
    
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: ent.s3_bucket_name,
                    Key: uniqueFileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                },
            });
    
            try {
                const uploadData = await upload.done();
                return uploadData.Key;
            } catch (err) {
                console.error('Error uploading file:', err);
                throw new Error(`Error uploading file ${file.originalname}: ${err}`);
            }
        };
    
        imageFileKey = await uploadFile(data.imageFile); 
      // Update imageFileKey with the new file key
    }
    
    try {
        const conn = await getConnection();
        // const queryParams = [
        //     data.role_id,
        //     data.user_name ,
        //     data.full_name,
        //     data.desig_id,
        //     data.user_active,
        //     imageFileKey,  // Use the new or existing imageFile key
        //     data.mo_by,
        //     data.entity_id,
        //     data.branch_id,
        //     data.user_id,
        // ];
    
        // if (data.user_password == '') {
        //     await conn.query(
        //         `UPDATE users SET role_id = ?, user_name = ?, full_name = ?,desig_id= ? , user_active = ?, imageFile = ?, mo_by = ?, mo_on = NOW() 
        //          WHERE entity_id = ? AND branch_id = ? AND user_id = ?`,
        //         queryParams
        //     );
        // } else {
        //     const hashpassword = await getPasswordHash(String(data.user_password));
        //     data.user_password = hashpassword;
            
        //     await conn.query(
        //         `UPDATE users SET role_id = ?, user_name = ?, full_name = ?, desig_id= ? , user_active = ?, user_password = ?, imageFile = ?, mo_by = ?, mo_on = NOW() 
        //          WHERE entity_id = ? and branch_id= ? AND user_id = ?`,
        //         [
        //             data.role_id,
        //             data.user_name,
        //             data.full_name,
        //             data.desig_id,
        //             data.user_active,
        //             data.user_password,
        //             imageFileKey,
        //             data.mo_by,
        //             data.entity_id,
        //             data.branch_id,
        //             data.user_id // role_id, user_name, full_name, user_active
        //         ]
        //     );
        // }

        const queryParams = [
          data.role_id,
          data.full_name,
          data.desig_id,
          data.user_active,
          imageFileKey,  // Use the new or existing imageFile key
          data.mo_by,
          data.entity_id,
          data.branch_id,
          data.user_id,
      ];
      
      // Base query without `user_name`
      let query = `UPDATE users SET role_id = ?, full_name = ?, desig_id= ? , user_active = ?, imageFile = ?, mo_by = ?, mo_on = NOW()`;

      if (data.user_name && data.user_name.trim() !== '') {
          query = query.replace('SET', `SET user_name = ?,`) 
          queryParams.unshift(data.user_name); 
      }
      
      if (data.user_password == '') {
          query += ` WHERE entity_id = ? AND branch_id = ? AND user_id = ?`;
          await conn.query(query, queryParams);
      } else if(data.user_password && data.user_name){
            const hashpassword = await getPasswordHash(String(data.user_password));
            data.user_password = hashpassword;
            
            await conn.query(
                `UPDATE users SET role_id = ?, user_name = ?, full_name = ?, desig_id= ? , user_active = ?, user_password = ?, imageFile = ?, mo_by = ?, mo_on = NOW() 
                 WHERE entity_id = ? and branch_id= ? AND user_id = ?`,
                [
                    data.role_id,
                    data.user_name,
                    data.full_name,
                    data.desig_id,
                    data.user_active,
                    data.user_password,
                    imageFileKey,
                    data.mo_by,
                    data.entity_id,
                    data.branch_id,
                    data.user_id // role_id, user_name, full_name, user_active
                ]
            );
      }
    } catch (e: any) {
        logger.error(e);
        throw new ApiError(400, e.message);
    }
  }    


  static async updateProfileImage(data:{
    entity_id:number,
    branch_id:number,
    user_name:string,
    user_id:number,
    oldImgUrl:string,
    mo_by:number,
    imageFile:FileMetaData | string
  }){

    const getEntity = await Entity.getEntityById(data.entity_id);
    const ent = getEntity.data[0];        
    if (
        (ent.s3_region == null || ent.s3_region == '') ||
        (ent.s3_access_key_id == null || ent.s3_access_key_id == '') ||
        (ent.s3_secret_access_key == null || ent.s3_secret_access_key == '') ||
        (ent.s3_bucket_name == null || ent.s3_bucket_name == '') ||
        (ent.s3_cloudfront_url == null || ent.s3_cloudfront_url == '')
    ) {
        throw new ApiError(400, 'Add S3 configuration details');
    }

    const query1 = `SELECT imageFile FROM users WHERE entity_id = ${data.entity_id} AND branch_id = ${data.branch_id} AND user_id = ${data.user_id} AND user_name='${data.user_name}'`;
    const result = await query(query1); //  ACTUALLY THIS QUERY IS NOT REQUIRED BEACUASE WE ARE SENDING THE IMAGEFILE STROED IN DB DIRECTLY THROUGH DATA OBJECT FROM FRONTEND ,data.oldImgUrl
    
    let imageFileKey = result.data[0]?.imageFile ? result.data[0].imageFile : data.oldImgUrl;

    if (data.imageFile) {
      const s3Client = new S3Client({
        region: ent.s3_region,
        credentials: {
          accessKeyId: ent.s3_access_key_id,
          secretAccessKey: ent.s3_secret_access_key,
        },
      });
  
      // Delete the existing file if present
      if (imageFileKey) {
          const deleteParams = {
              Bucket: ent.s3_bucket_name,
              Key: imageFileKey,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
      }
  
      // Upload the new file
      const uploadFile = async (file: any) => {
        
        const fileParts = file.originalname.split('.');
        const fileExtension = fileParts.pop();
        const timestamp = `${new Date().getTime()}_${getRandomNumber(100000, 1000000)}`;
        const uniqueFileName = `${data.entity_id}/${data.branch_id}/Profile/${timestamp}.${fileExtension}`;
  
          const upload = new Upload({
              client: s3Client,
              params: {
                  Bucket: ent.s3_bucket_name,
                  Key: uniqueFileName,
                  Body: file.buffer,
                  ContentType: file.mimetype,
              },
          });
  
          try {
              const uploadData = await upload.done();
              return uploadData.Key;
          } catch (err) {
              console.error('Error uploading file:', err);
              throw new Error(`Error uploading file ${file.originalname}: ${err}`);
          }
      };
  
      imageFileKey = await uploadFile(data.imageFile); 
    // Update imageFileKey with the new file key
  }
  try {
    const conn = await getConnection();
    
    const queryParams = [
        imageFileKey,  // Use the new or existing imageFile key
        data.mo_by,
        data.entity_id,
        data.branch_id,
        data.user_id,
    ];

        await conn.query(
            `UPDATE users SET imageFile = ?, mo_by = ?, mo_on = NOW() 
             WHERE entity_id = ? AND branch_id = ? AND user_id = ? `,
            queryParams
        );
        return { imageFileKey};

  }catch(e:any){
    throw new ApiError(400, e.message);
  }
}



static async getAllUsersloginTime (entity_id: number, user_id: string, page: number, limit: number)
{
  try{
    let _query = `SELECT 
      u.full_name,
      MAX(s.login_time) AS first_login_time
      FROM 
          users u
      LEFT JOIN 
          session s 
      ON 
          u.entity_id = s.entity_id 
          AND u.user_id = s.user_id
          AND DATE(s.login_time) = '${getCurrentDate()}'
      WHERE 
          u.entity_id = ${entity_id}`

      if (user_id != '') {
        _query += ` and u.user_id = ${user_id}`;
      }

      _query += ` GROUP BY 
          u.user_id
      ORDER BY 
          u.user_id`;

    if (limit) {
      _query += ` limit ${limit} offset ${Number(page) * Number(limit)} `;
    }

    return await query(_query);
  }
  catch(error){
    throw new Error('Database query failed');
  }

}

}