import { getId, insertTable, query, updateTable } from "../utils/db";



export class designation_model {
  entity_id?: number;
  desig_id?: number;
  name?: string;
  cr_on?: string;
  cr_by?: string;
  mo_on?: string;
  mo_by?: string;

  static async getDesignations(entity_id: string,name?:string,limit?:number,page?:number) {
    let _query = `select * from designation where entity_id = ?`;
    if(name){
      _query+=`and  name like '%${name.toLowerCase()}%'`
    }
    if (limit && limit != -1) {
      _query += ` limit ${Number(limit) ? Number(limit) : 15} offset ${
        Number(page) * Number(limit)
      }`;
    }
    const _params: (string | number)[] = [entity_id];

    const { data: allDesignations } = await query(_query, _params);

    return { data: allDesignations };
  }

  static async addDesignation(entity_id: string, name: string, cr_by: number) {

    const desig_id = await getId({
      table: 'designation',
      column: 'desig_id',
      where: {
        entity_id
      }
    })

    const data = await insertTable({
      table: 'designation',
      data: { entity_id, desig_id: desig_id.data[0].desig_id, name, cr_by }
    });

    return data.result;
  }

  static async updateDesignation(data: {
    entity_id: number,
    desig_id: number,
    name: string,
    is_active:boolean,
    mo_by: number
  }) {

    const {result} = await updateTable({
      table: 'designation',
      data: {
        name: data.name,
        is_active:data.is_active,
        mo_by : data.mo_by
      },
      where : {
        entity_id : data.entity_id,
        desig_id : data.desig_id
      }
    })

    return result;
  }

}
