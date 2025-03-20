import { getRandomNumber } from '../utils';
import { ApiError } from '../utils/ApiError';
import { getId, insertTable, query, updateTable } from '../utils/db';
import { S3Client ,DeleteObjectCommand} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

interface FileMetaData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class Entity {
  entity_id = 0;
  name = '';
  short_desc = '';
  address = '';
  email = '';
  reg_num = '';
  estab_date = '';
  expiry_date = '';
  bank_ac_num = '';
  bank_ifsc = '';
  bank_name = '';
  bank_location = '';
  cr_on? = 'NOW()';
  cr_by? = '';
  mo_on?: string | null = null;
  mo_by?: string | null = null;
  gst_no:string | null = null;
  country?: string | null = null;
  state?: string | null = null;
  city?: string | null = null;
  area?:string | null = null;
  pincode?: string | null = null;
  additional_info?:string | null = null
  phone_num:string | null = null;

  // S3 RELATED INFORMATION
  s3_region?:string | null = null;
  s3_access_key_id?:string | null = null;
  s3_secret_access_key?:string | null = null;
  s3_bucket_name?:string | null = null;
  s3_cloudfront_url?:string;
  imageFile?:FileMetaData | null = null;

  //extra
  areas?:string[]=[];
  entityImage ?:string;

  
  static async get_entity(entity_id?: number) {
    // if (entity_id != 1) {
    //   // return await query<Entity>(
    //   //   "select *,to_char(estab_date,'yyyy-mm-dd') as estab_date from entity where entity_id = $1 ;",
    //   //   [entity_id]
    //   // );
    //   return ;
    // }
    console.log(entity_id)
    return await query<Entity>(
      `SELECT entity_id , name , short_desc , email ,  address , reg_num , bank_ac_num ,
       bank_ifsc , bank_name , bank_location , gst_no , country , state , city ,area, pincode ,
        additional_info ,phone_num, DATE_FORMAT(estab_date, '%Y-%m-%d') AS estab_date ,
         DATE_FORMAT(expiry_date, '%Y-%m-%d') AS expiry_date,s3_region,
         s3_access_key_id,s3_secret_access_key,s3_bucket_name,s3_cloudfront_url,gmail_id ,
    app_password,imageFile as entityImage FROM entity;`
    );
  }

  // static async get_name(entity_id?: number) {
  //   let _query = 'select entity_id,name from entity ';
  //   const _params = [];
  //   if (entity_id) {
  //     _query += ' where entity_id = $1';
  //     _params.push(entity_id);
  //   }
  //   return await query<Entity>(_query, _params);
  // }

  static async add(data: Entity, cr_by:string) {
    const { data: id } = await getId({
      table: 'entity',
      column: 'entity_id',
      where: {},
    });
    if (!id) {
      return;
    }
    data = {...data , entity_id : id[0].entity_id, cr_by:cr_by};
    const { areas,entityImage, ...dataToInsert } = data;

    const result = await insertTable({
      table: 'entity',
      data: dataToInsert,
    });
    if(result.result){
      return data.entity_id;
    }else {
      return ;
    }
  }


  static async update(data: Entity,mo_by:string) {
    const query1 = `SELECT imageFile FROM entity WHERE entity_id = ${data.entity_id}`;
    const result = await query(query1);
  
    const imageFileKey = result.data[0]?.imageFile;
  
    if (data.imageFile) {
      const getEntity = await this.getEntityById(data.entity_id);
      const ent = getEntity.data[0];
  
      if (
        !ent.s3_region ||
        !ent.s3_access_key_id ||
        !ent.s3_secret_access_key ||
        !ent.s3_bucket_name ||
        !ent.s3_cloudfront_url
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
  
      // Delete existing image file if and only if a new image is being uploaded
      if (imageFileKey) {
        try {
          const deleteParams = {
            Bucket: ent.s3_bucket_name,
            Key: imageFileKey,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        } catch (err) {
          console.error('Error deleting old image:', err);
          throw new Error('Failed to delete the existing image from S3');
        }
      }
  
      // Upload new file
      const uploadFile = async (file: any) => {
        const fileParts = file.originalname.split('.');
        const fileExtension = fileParts.pop();
        const timestamp = `${new Date().getTime()}_${getRandomNumber(100000, 1000000)}`;
        const uniqueFileName = `${data.entity_id}/Logo/${timestamp}.${fileExtension}`;
  
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
          const uploadResult = await upload.done();
          return uploadResult;
        } catch (err) {
          console.error('Error uploading file:', err);
          throw new Error(`Error uploading file ${file.originalname}: ${err}`);
        }
      };
  
      try {
        const uploadResult = await uploadFile(data.imageFile);
        if (uploadResult.Key) {
          const key = uploadResult.Key;
          data.imageFile = key as unknown as FileMetaData;
        }
      } catch (err) {
        throw new Error('File upload failed');
      }
    }
    try{
      if (!data.imageFile && imageFileKey) {
        data.imageFile = imageFileKey;
      }
      return await updateTable({
        table: 'entity',
        data: {...data, mo_by:mo_by},
        where: { entity_id: data.entity_id },
      });
    }catch(err){
      console.error('Error updating entity table:', err);
      throw new Error('Failed to update entity in database');
    }
  }

  static async getEntityAndBranchName(data : {
    entity_id: number,
    branch_id : number
  }){
    const entity_data = await query(`select
        b.name as branch_name,
        e.name as entity_name
    from
        branch b
    join 
        entity e
    on
        e.entity_id = b.entity_id
    where
        b.entity_id = ${data.entity_id}
        and b.branch_id = ${data.branch_id}`);

    if(!entity_data.result){
        throw new ApiError(400 , 'Failed to get entity details')
    }
    return entity_data.data[0];
  }

  static async getEntityById(entity_id?: number) 
  {
    return await query(`select * from entity where entity_id = ?`, [entity_id]);
  }
}
