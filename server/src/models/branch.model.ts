import { getId, insertTable, query, updateTable } from '../utils/db';

export class branchModel {
    entity_id?: number;
    branch_id?: number;
    name?: string;
    country?:string;
    state?:string;
    city?:string;

    static async getAllBranches(data:{entity_id ?: string,name?:string,limit?:number,page?:number}) {
        const {entity_id,name,limit,page}=data
        let _query = `SELECT entity_id, branch_id, name, branch_incharge_name, address1, address2, pincode, country, state, city, area, is_active FROM branch`;

        if(entity_id){
            _query += ` where entity_id = ${entity_id}`
        }
        if (name) {
            _query += ` and name like '%${name.toLowerCase()}%'`;
          }
        _query += ` ORDER BY entity_id`

          if (limit && limit != -1) {
            _query += ` limit ${Number(limit) ? Number(limit) : 15} offset ${
              Number(page) * Number(limit)
            }`;
          }

        const response = await query(_query);
        if (response.result) {
            return response.data;
        }
        return;
    }

    static async updatebranch(data: {
        entity_id: number;
        branch_id: number;
        name: string;
        branch_incharge_name: string;
        address1: string;
        address2: string;
        pincode: number;
        country: string;
        state: string;
        city: string;
        area: string;
        mo_by: number;
        is_active: 0 | 1;
    }) {
        const response = await updateTable({
            table: 'branch',
            data: {
                name: data.name,
                branch_incharge_name: data.branch_incharge_name,
                address1: data.address1,
                address2: data.address2,
                pincode: data.pincode,
                country: data.country,
                state: data.state,
                city: data.city,
                area: data.area,
                mo_by: data.mo_by,
                is_active: data.is_active
            },
            where: {
                entity_id: data.entity_id,
                branch_id: data.branch_id,
            },
        });
        if (response.result) {
            return true;
        }
        return;
    }

    static async AddBranch(data: { entity_id: string; name: string; branch_incharge_name: string; address1: string; address2: string; pincode: number; country: string; state: string; city: string; area: string; cr_by: number }) {
        const { data: id } = await getId({
            table: 'branch',
            column: 'branch_id',
            where: {
                entity_id: data.entity_id,
            },
        });
        
        if (id.length < 1) {
            return;
        }

        const response = await insertTable({
            table: 'branch',
            data: {
                entity_id: data.entity_id,
                branch_id: id[0].branch_id,
                name: data.name,
                branch_incharge_name: data.branch_incharge_name,
                address1: data.address1,
                address2: data.address2,
                pincode: data.pincode,
                country: data.country,
                state: data.state,
                city: data.city,
                area: data.area,
                cr_by: data.cr_by
            },
        });

        if (response.result) {
            return true;
        }
        return;
    }
}
