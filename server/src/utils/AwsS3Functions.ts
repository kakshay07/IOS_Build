import { getRandomNumber } from '../utils';
import { ApiError } from '../utils/ApiError';
import { Entity } from '../models/entity.models';
import { S3Client, DeleteObjectCommand  } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

interface FileMetaData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

interface AWSMetadata {
    httpStatusCode?: number;
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

// FUNCTION TO UPLOAD FILES TO S3 BUCKET 
export const uploadFilesToAWSS3 = async (entity_id: number, branch_id: number, file: FileMetaData | undefined | null, extra_path?: string) : Promise<AWSUploadResponse> => {
    
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
    const uniqueFileName = `${entity_id}/${branch_id}/${extra_path ? `${extra_path}/${timestamp}.${fileExtension}` : `${timestamp}.${fileExtension}`}`;

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



//FUNCTION TO FILES FROM S3 BUCKET
export const deleteFilesFromAWSS3 = async (entity_id: number, key_path: string) => {

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
        throw new Error(`Error deleting file: ${err}`);
    }
}