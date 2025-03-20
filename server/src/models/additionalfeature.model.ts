import { query, updateTable } from '../utils/db';
import MessageTemplates from '../utils/MessageTemplates'
import { ApiError } from '../utils/ApiError';
import { sendMail } from '../utils';

export class AdditionalFeatureModel {
    entity_id?:number;
    feature_name?: string;
    feature_type?:string;
    is_active?: number;
    cr_by?:string;
    cr_on?: string;

    template_subject?:string;
    template_body?:string;

    static async getAllAdditionalFeature () {
        let _query = `select feature_name,feature_type,is_active from additional_features`
        return await query(_query)
    }

    static async addAdditionalFeature (feature_name:string, feature_type:string,is_active:number,cr_by:number) {
        let _query = `insert into additional_features (feature_name,feature_type,is_active,cr_by,cr_on) values (?,?,?,?,NOW())`
        const response = await query (_query,[feature_name,feature_type,is_active,cr_by])
        if(response.result) {
            return true;
        }
        return;
    }

    static async updateAdditionalFeature(feature_name:string,is_active:number,mo_by:number){
        let _query =  `update additional_features set is_active = ?,mo_by = ?, mo_on = NOW() where feature_name = ? `
        const response = await query(_query,[is_active,mo_by,feature_name])
        if(response.result) {
            return response.data
        }
        return
    }

    static async giveAccessToEntity(data : {
        features : AdditionalFeatureModel[],
        entity_id : number,
        cr_by : number
    }){
       const features = data.features;
       const entity_id = data.entity_id;
       const cr_by = data.cr_by;

       const email_features = features.filter(feature => feature.feature_type == 'E');
       const sms_features = features.filter(feature => feature.feature_type == 'S');
        
        let _delete_query = 'DELETE FROM additional_features_access WHERE entity_id = ?';
        let _delete_params : any[] = [entity_id]
        if(features && features.length > 0){
            _delete_query += ' AND feature_name NOT IN (?)';
            _delete_params.push(...features
                    .map((feature) => feature.feature_name)
                    .filter((name) => name !== undefined))
        }
        await query(
            _delete_query,
            _delete_params
        );

        for(let f of email_features){
            const feature = f;
            const default_email_template = MessageTemplates.email_templates.find(_ => _.feature_name == feature.feature_name);

            const existingRow = await query('select * from additional_features_access where entity_id = ? AND feature_name = ?', [entity_id, feature.feature_name]);

            if(existingRow && existingRow.data.length < 1){
                const _query = 'Insert into additional_features_access (entity_id, feature_name, template_subject, template_body, cr_by, cr_on) values (?,?,?,?,?,NOW())';
                const _params = [entity_id, feature.feature_name, default_email_template?.subject , default_email_template?.body , cr_by];
                await query(_query , _params);
            }
        }

        
        for(let s of sms_features){
            const feature = s;
            const default_sms_template = MessageTemplates.sms_templates.find(_ => _.feature_name == feature.feature_name);

            const existingRow = await query('select * from additional_features_access where entity_id = ? AND feature_name = ?', [entity_id, feature.feature_name]);

            if(existingRow && existingRow.data.length < 1){
                const _query = 'Insert into additional_features_access (entity_id, feature_name, template_body, cr_by, cr_on) values (?,?,?,?,NOW())';
                const _params = [entity_id, feature.feature_name, default_sms_template?.body , cr_by];
                await query(_query , _params);
            }
        }
    }

    static async getAccessOfEntity(data : {
        entity_id : number,
    }){
        const entity_id = data.entity_id;
        const _query = 'select AFA.*, AF.feature_type from additional_features_access AFA join additional_features AF on AF.feature_name = AFA.feature_name  where entity_id = ?';
        const _params = [entity_id];
        const result = await query(_query , _params);
        return result.data;
    }

    static async updateAdditionalFeaturesTemplate(data : AdditionalFeatureModel){
        const feature = data;
        let response;

        // == If feature is Email related ==
        if(feature.feature_type == 'E')
        response = await updateTable({
            table : 'additional_features_access',
            data : {
                template_subject : feature.template_subject,
                template_body : feature.template_body
            },
            where : {
                entity_id : feature.entity_id,
                feature_name : feature.feature_name
            }
        })

        if(!response?.result) {
            throw new ApiError(400 , 'Could not update Features Template')
        }
        return false;
    }


    static async sendTestEmail(data : {
        to_email : string,
        entity_id : number
    }){
        const {entity_id, to_email} = data;
        const feature_name = 'send_email_on_invoice_raise';

        const entity_details = await query('select gmail_id , app_password from entity where entity_id = ?' , [entity_id]);
            
        // To check if the entity has gmail and app_password
        if(entity_details.data && entity_details.data.length > 0) {
            const {gmail_id , app_password} = entity_details.data[0];
            const template_details = await query('select AFA.template_body, AFA.template_subject, AFA.feature_name, AF.is_active from additional_features_access AFA join additional_features AF on AF.feature_name = AFA.feature_name where AFA.entity_id = ? and AFA.feature_name = ?' , [entity_id, feature_name]);
            // To check if the entity has access to this feature
            if(template_details.data && template_details.data.length > 0){
                let {template_body  } = template_details.data[0];
                const {template_subject} = template_details.data[0];
                const variables = ['client_name','company_name'];
                const values : any = {
                    client_name : 'Test User',
                    company_name : 'Test Company'
                }

                // To Replace variables with actual values
                for(const variable of variables){
                    template_body = template_body.replace(`{{${variable}}}`, values[variable]);
                }

                await sendMail({
                    from : gmail_id,
                    to : to_email,
                    subject : template_subject,
                    body : template_body,
                    pass : app_password,
                    attachment : [{
                        filename : 'test.png',
                        content : 'https://d25kqhcxhjw32g.cloudfront.net/1/1/Profile/1731925734779_797362.png',
                        contentType: 'image/png'
                    }]
                })

            }else {
                throw new ApiError(400, 'Feature Not Accessible')
            }

        } else {
            throw new ApiError(400, 'Gmail Details not found')
        }


    }

}



