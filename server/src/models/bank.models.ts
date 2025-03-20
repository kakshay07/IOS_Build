import { query } from "../utils/db";

export class bankModel {
  bank_code?: string;
  bank_desc?: string;
  order_sl?: string;
  acnt_type?: string;
  acnt_desc?: string;

  static async getBankName() {
    const _query = `SELECT BANK_CODE ,BANK_DESC ,ORDER_SL FROM act_global.bank_master`;
    const response = await query(_query);
    if (response.result) {
      return response.data;
    }
    return;
  }

  static async getBankType() {
    const _query = `SELECT ACNT_TYPE ,ACNT_DESC FROM act_global.bank_account_type`;
    const response = await query(_query);
    if (response.result) {
      return response.data;
    }
    return;
  }
}
