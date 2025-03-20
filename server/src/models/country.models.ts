import { query } from '../utils/db';

export class countryModel{
country_code?:string | null ;
country_iso?:string ;
country_name?:string;
country_phone?:string;


static async getAllCountryWithCode(entity_id?:string){
    let _query=`SELECT COUNTRY_CODE, COUNTRY_ISO, COUNTRY_NAME,COUNTRY_PHONE FROM act_global.COUNTRY`
    if(entity_id){
        _query += ` where entity_id = ${entity_id}`
    }
    _query += ` ORDER BY COUNTRY_CODE`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;

}

}
