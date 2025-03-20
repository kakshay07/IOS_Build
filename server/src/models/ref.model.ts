import {query} from '../utils/db'
import { ApiError } from "../utils/ApiError";

export class refModel{
    
    static async generateRefNum(data : {
        date : string,
        entryCode : string,
        entity_id : number,
        branch_id : number,
        ref_column ?: string,
        table?: string
    }){
        // Validate the date format (YYYY-MM-DD)
        const dateParts = data.date.split('-');
        if (dateParts.length !== 3 || dateParts[0].length !== 4 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
            throw new Error('Invalid date format');
        }
        const _query = `
        SELECT 
            IFNULL(MAX(CAST(SUBSTRING_INDEX(${data.ref_column ? data.ref_column : 'ref_num'}, '-', -1) as INT)), 0) + 1 AS next_serial 
        FROM 
            ${data.table ? data.table : 'ledger'}
        WHERE 
            entity_id = ${data.entity_id} and branch_id = ${data.branch_id} and ${data.ref_column ? data.ref_column : 'ref_num'}  LIKE '${data.entryCode}-${data.date.split('-').join('')}-%'
        `;
        const response = await query(_query);
        // console.log(response , 'response==========');
        
        if(!response.result){
            throw new ApiError(400 , 'Could not generate Refference ID')
        }
        const nextSerial = response.data[0].next_serial;
        // console.log(nextSerial , 'nextSerial==========');

        const nextRef = `${data.entryCode}-${data.date.split('-').join('')}-${nextSerial}`
        // console.log(nextRef , 'nextRef==========');

        return nextRef;
    }

}