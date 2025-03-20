import { query } from "../utils/db";


export class ReadingLogModel {
  entity_id: number | null = null;
  branch_id: number | null = null;
  entry_date: string | null = null;
  machine_name?: "E" | "K" | "C" | "" = "";
  machine_identity_no?: string | null = null;
  reading?: number | null = null;
  hour?: number | null = null;
  new?: true | false;

  static async getReadinglogOfentryDate(data: {
    entity_id: number;
    branch_id: number;
    entry_date: string;
    machine_name: string;
  }) {
    const _query = `Select *, TRUE AS old_data from reading_log where entity_id = ? and branch_id = ? and machine_name=? and 
                   DATE(entry_date)=?`;
    const _params: (string | number)[] = [
      data.entity_id,
      data.branch_id,
      data.machine_name,
      data.entry_date,
    ];
    const response = await query(_query, _params);
    return response;
  }

  static async GetLastmodifiedDate(data: {
    entity_id: number;
    branch_id: number;
    entry_date: string;
    machine_name: string;
  }){
    const _query = `Select mo_on ,machine_identity_no,machine_name,cr_on ,hour,reading ,entry_date from reading_log where entity_id = ? and branch_id = ? and machine_name=? and 
    DATE(entry_date)=?`;
    const _params: (string | number)[] = [
    data.entity_id,
    data.branch_id,
    data.machine_name,
    data.entry_date,
    ];
    const response = await query(_query, _params);
    return response;

  }

  static async AddReadingsForMachine(
    entity_id: number,
    branch_id: number,
    dataArray: Array<{
      entry_date: string;
      machine_name: string;
      machine_identity_no: string;
      reading: number;
      hour: number;
      new: boolean;
      edited_old_data: boolean;
      old_data: 1 | 0;
    }>,
    cr_by: number
  ) {
    const ArrayToInsert = dataArray.filter((_) => _.new == true);
    for (const data of ArrayToInsert) {
      const result = await query(
        `INSERT INTO reading_log 
                (entity_id,branch_id,hour,machine_identity_no,entry_date,machine_name,reading,cr_on,cr_by)
                values( ?,?,?,?,?,?,?,NOW(),?)
                `,
        [
          entity_id,
          branch_id,
          data.hour,
          data.machine_identity_no,
          data.entry_date,
          data.machine_name,
          data.reading,
          cr_by,
        ]
      );
      if (!result) {
        throw new Error("Couldnot add readings");
      }
    }
    const ArrayToUpdate = dataArray.filter(
      (_) => _.edited_old_data == true && _.old_data == 1
    );
    for (const update of ArrayToUpdate) {
      const response =
        await query(`Update reading_log set reading =${update.reading} ,mo_on=Now() ,mo_by=${cr_by} where entity_id =${entity_id} and branch_id=${branch_id} and 
            hour=${update.hour} and machine_identity_no='${update.machine_identity_no}' and entry_date ='${update.entry_date}'`);
      if (!response.result) {
        throw new Error("Couldnot update changed readings");
      }
    }
    return true;
  }

  static async GetDataForExcellDownload(data:{
    entity_id : number,
    branch_id : number,
    from_date : string,
    to_date : string,
    machine_name : string
  }){
    const {entity_id,branch_id,from_date,to_date,machine_name} = data
    const _query = `Select * from reading_log where entity_id = ? and branch_id = ? and machine_name=? and DATE(entry_date) between ? and ? order by entry_date Asc,machine_identity_no`;
    const _params: (string | number)[] = [entity_id,branch_id,machine_name,from_date,to_date];
    const response = await query(_query, _params);
    return response;
  }
}