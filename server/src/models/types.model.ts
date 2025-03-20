import { toMysqlDatetime } from "../utils";
import { getId, insertTable, query } from "../utils/db";

export class TypesModel {
    entity_id:number | null = null;
    branch_id:number | null = null;
    sl?:number | null = null;
    type_id:number | null = null;
    type_name:string | null =null;
    type_desc:string | null = null;
    measure_unit:string | null = null;
    machine_name:string | null = null;

    static async GetAllTypes(entity_id:number,branch_id:number,type_name?:string,limit?:number,page?:number){
        let _query = `Select t.* ,count(t.type_name) as types_count from types t where entity_id= ? and branch_id= ?`
        if(type_name){
            _query+=`and type_name like '%${type_name.toLowerCase()}%'`
          }
          _query+=` group by t.machine_name ,t.type_name`
        if (limit && limit != -1) {
            _query += ` limit ${Number(limit) ? Number(limit) : 15} offset ${
              Number(page) * Number(limit)
            }`;
          }
        const _params: (string | number)[] = [entity_id,branch_id];
        const data=await query(_query, _params);
        return data
    }

    static async GetAllTypesByTypeName(entity_id:number,branch_id:number,typeName:string,machine_name?:string){
        const _query = `Select machine_name,type_name ,type_desc,sl,entity_id,branch_id,measure_unit,cr_on,cr_by from types where entity_id= ? and branch_id=? and type_name= ? and machine_name=?`
        const _params: (string | number)[] = [entity_id,branch_id,typeName,String(machine_name)];
        const data=await query(_query, _params);
        return data
    }

    static async GetAllTypesName(entity_id:number,branch_id:number){
      const _query = `Select machine_name,type_name ,type_desc,sl,entity_id,branch_id,measure_unit,cr_on,cr_by from types where entity_id= ? and branch_id=?`
      const _params: (string | number)[] = [entity_id,branch_id];
      const data=await query(_query, _params);
      return data
  }

    static async UpdateActiveInactiveStatus(data:{entity_id:number,branch_id:number,type_name:string,is_active:number,mo_by:number}){
        const {entity_id,branch_id,type_name,is_active,mo_by}=data
        const _query =`Update types set is_active = ${is_active == 1 ? 0 : 1} ,mo_on=Now() ,mo_by = ${mo_by}
                     where entity_id= ${entity_id} and branch_id=${branch_id} and type_name='${type_name}'`
        const response=await query(_query);
        if(response.result){
            return true
        }
        return false
    }

    static async AddTypesData (entity_id:number,branch_id:number,typesarray:Array<{machine_name:string,type_name:string,type_desc:string,measure_unit:string}>,cr_by:number){
        for(const types of typesarray){
            const sl = await getId({
                table: 'types',
                column: 'sl',
                where: {
                  entity_id :entity_id,
                  branch_id:branch_id,
                  type_name:types.type_name
                }
              });
              const data = await insertTable({
                table: "types",
                data: { 
                    entity_id,
                    branch_id: branch_id,
                    sl:sl.data[0].sl,
                    machine_name:types.machine_name, // new added
                    type_name:types.type_name,
                    type_desc:types.type_desc,
                    measure_unit:types.measure_unit,
                    cr_by:cr_by
                     },
              });
              if(!data.result){
                return false;
              }
        }
        return true;
    }

    static async UpdateTypesData(entity_id:number,branch_id:number,typesarray:Array<{machine_name:string,type_name:string,type_desc:string,measure_unit:string,cr_on:string,cr_by:number}>,mo_by:number){
        const _query =`Delete from types where entity_id=${entity_id} and branch_id=${branch_id} and type_name='${typesarray[0].type_name}'`
        await query(_query);
        for(const types of typesarray){
            const sl = await getId({
                table: 'types',
                column: 'sl',
                where: {
                  entity_id :entity_id,
                  branch_id:branch_id,
                  type_name:types.type_name
                }
              });
              const data = await insertTable({
                table: "types",
                data: { 
                    entity_id,
                    branch_id: branch_id,
                    sl:sl.data[0].sl,
                    machine_name:types.machine_name,
                    type_name:types.type_name,
                    type_desc:types.type_desc,
                    measure_unit:types.measure_unit,
                    cr_by:types.cr_by ? types.cr_by : mo_by,
                    cr_on:types.cr_on ? types.cr_on :toMysqlDatetime(new Date()),
                    mo_by:mo_by,
                    mo_on:toMysqlDatetime(new Date())
                     },
              });
              if(!data.result){
                return false;
              }
        }
        return true;
    }
}