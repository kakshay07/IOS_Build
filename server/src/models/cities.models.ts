import { query } from "../utils/db";

export class cityModel{
city_code?:string | null ;
city_name?:string;
state_code?:string;



static async getAllCityWithStateCode(data : {state_code?:string}){
    let _query=`SELECT CITY_CODE, CITY_NAME FROM act_global.CITIES`
    if(data.state_code){
        _query += ` WHERE STATE_CODE = ${data.state_code}`
    }
    _query += ` ORDER BY CITY_CODE`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;
}

}
