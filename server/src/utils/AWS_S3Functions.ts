import { getRandomNumber } from '../utils';
import { ApiError } from '../utils/ApiError';
import { Entity } from '../models/entity.models';
import { S3Client, DeleteObjectCommand  } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// uploadFilesToAWSS3 : response={
//     {
//         '$metadata': {
//           httpStatusCode: 200,
//           requestId: '247WAR3D2VB69EZX',
//           extendedRequestId: 'zpGRyYjh+4UuDXXPv0UsiDjbdZc4z3J3EGz1GF4w/TR+4nSNACv7uD97oOSGU3YZ6MuA2lAW5LY=',
//           cfId: undefined,
//           attempts: 1,
//           totalRetryDelay: 0
//         },
//         ETag: '"9ccd20c630e9cac94ace3bab1d7aacc2"',
//         ServerSideEncryption: 'AES256',
//         Bucket: 'act-test',
//         Key: 'file/36.png',
//         Location: 'https://act-test.s3.eu-north-1.amazonaws.com/file/36.png'
//       }
// }

interface AWSMetadata {
    httpStatusCode?: number; // Allow undefined
    requestId?: string;
    extendedRequestId?: string;
    cfId?: string;
    attempts?: number;
    totalRetryDelay?: number;
  }
  
  interface AWSUploadResponse {
    '$metadata': AWSMetadata;
    ETag?: string;
    ServerSideEncryption?: string;
    Bucket?: string;
    Key?: string;
    Location?: string;
  }

interface FileMetaData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }

export class AWS_S3_Model{
static async uploadFilesToAWSS3(entity_id: number, branch_id: number, file: FileMetaData | undefined): Promise<AWSUploadResponse>
    {
      
        const getEntity = await Entity.getEntityById(entity_id);
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

        // Initialize the S3 client
        const s3Client = new S3Client({
            region: ent.s3_region,
            credentials: {
            accessKeyId: ent.s3_access_key_id,
            secretAccessKey: ent.s3_secret_access_key,
            },
        });

        const fileParts = file?.originalname.split('.');
        const fileExtension = fileParts?.pop();
        const timestamp = `${new Date().getTime()}_${getRandomNumber(100000, 1000000)}`;
        const uniqueFileName = `${entity_id}/${branch_id}/${timestamp}.${fileExtension}`;

        const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: ent.s3_bucket_name,
            Key: uniqueFileName,
            Body: file?.buffer,
            ContentType: file?.mimetype, // Sets correct file type
        },
        });

        try {
            const data = await upload.done();
            console.log('Upload success:', data);
            return data;
        } catch (err) {
            console.error('Error uploading file:', err);
            throw new Error(`Error uploading file ${file?.originalname}: ${err}`);
        }
    }

    static async deleteFilesFromAWSS3(entity_id: number, key_path: string)
    {
        //Getting all S3 details
        const getEntity = await Entity.getEntityById(entity_id);
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

        try {
            
            const s3Client = new S3Client({
                region: ent.s3_region,
                credentials: {
                    accessKeyId: ent.s3_access_key_id,
                    secretAccessKey: ent.s3_secret_access_key,
                },
            });
            
            const params = {
                Bucket: ent.s3_bucket_name,
                Key: key_path
            };
            
            
            const res = await s3Client.send(new DeleteObjectCommand(params));

            return res;
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    }
}