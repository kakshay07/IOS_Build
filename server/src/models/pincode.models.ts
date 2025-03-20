import { ApiError } from '../utils/ApiError';
import { getId, insertTable, query, updateTable } from '../utils/db';

export class pincodeModel 
{
    sl?: string;
    pincode?: number;
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    area?: string;
    is_active?: string;

    static async getPincodeMaster(state: string, city: string, page: number, limit: number) 
    {
        let _query = 'select * from act_global.pincode_master where is_active = 1';
        if (state) {
          _query += ` and state like '%${state}%'`;
        }
        if (city) {
          _query += ` and city like '%${city}%'`;
        }
        _query += ` order by pincode asc `;

        if (limit) {
          _query += ` limit ${limit} offset ${Number(page) * Number(limit)} `;
        }
        return await query(_query); 
    }

//  THIS IS USED ONLY FOR GETTING STATE AND CITY BASED ON PINCODE

static async getDataUsingPincodeParam(pincode:number){
    let _query ='Select country_code,state_code,city_code,district,area, pincode,is_active country from act_global.pincode_master'
    _query += ` where pincode='${pincode}'`;

    return await query(_query);
}

}