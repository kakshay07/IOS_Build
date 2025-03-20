import { query } from '../utils/db';

export class stateModel{
state_code?:string | null ;
state_name?:string ;
country_code?:string;
tin_code?:string;
state_gst_code?:string;
gst?:string;


static async getAllStateWithCountryCode(data:{country_code?:string}){
    let _query=`SELECT STATE_CODE, TIN_CODE, STATE_NAME, STATE_GST_CODE, GST  FROM act_global.STATES`
    if(data.country_code){
        _query += ` WHERE COUNTRY_CODE = ${data.country_code}`
    }
    _query += ` ORDER BY STATE_CODE`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;
}

}
