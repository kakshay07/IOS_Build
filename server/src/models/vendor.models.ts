import { getId, insertTable, query, updateTable } from "../utils/db";
import { ApiError } from "../utils/ApiError";


export class vendorModel{
    entity_id?: number | string;
    branch_id?: number | string;
    vendor_id?: number;
    name?: string | null = null;
    type?: string | null = null;
    is_outsource?:0 | 1 ;//new added 12-08
    address_1?: string | null = null;
    country?: string | null = null;
    state?: string | null = null;
    city?: string | null = null;
    area?:string //NEW ADDED
    pincode?: string | null = null;
    phone?: string | null = null;
    email?: string | null = null;
    reg_num?:string | null =null;
    gst_num?:string | null = null;
    poc_name?:string;
    poc_phone?:number;
    bank_name?:string | null = null;
    bank_acc_num?:string | null = null;
    bank_acc_type?:string | null =null;
    bank_branch_name?:string | null = null;
    is_active?:string| null  = null;
    cr_on?: string;
    cr_by?: string | number;
    mo_on?: string | number;
    mo_by?: string 

    static async AddVendor(data:vendorModel){
        try{
            const { data: vendor_id } = await getId({
                table: "vendor",
                column: "vendor_id",
                where: { entity_id: data.entity_id },
              });
              if(!vendor_id) return;
            data.vendor_id=vendor_id[0].vendor_id;
            const response = await insertTable({ table: "vendor", data });
            if (response.result) {
              return true;
            }
            return;

        }catch(err:any){
            throw new ApiError(400, err?.message)
        }
    }

    static async GetAllVendor(
        entity_id: number,
        branch_id: number,
        vendor_id: string,
        type: string,
        page: number,
        limit: number
    ){
        let _query = `Select * from vendor
        where entity_id = ? and branch_id = ?`;
        const _params: (string | number)[] = [entity_id, branch_id];
        if (vendor_id) {
            _query += ` and vendor_id = ?`;
            _params.push(vendor_id);
        }
        if (type) {
            _query += ` and type = ?`;
            _params.push(type);
        }
        _query += ` order by vendor_id`;
        if (limit && limit != -1) {
            _query += ` limit ${Number(limit) ? Number(limit) : 15} offset ${Number(page) * Number(limit)}`;
        }
        return await query(_query, _params);
    }
    
// static async UpdateVendor(data:{entity_id:number,branch_id:number,vendor_id:number,name:string,type:string,phone:string,email:string,address_1:string,country:string,state:string,city:string,pincode:string,mo_by:string}){
   static async UpdateVendor(data:vendorModel){
  const {result}=await updateTable({
    table:'vendor',
    data:{ 
        name:data.name,
        type:data.type,
        is_outsource:data.is_outsource,//new added 13-08
        phone:data.phone,
        email:data.email,
        address_1:data.address_1,
        country:data.country,
        state:data.state,
        city:data.city,
        area:data.area,//NEW ADDED
        pincode:data.pincode,
        poc_name:data.poc_name,
        poc_phone:data.poc_phone,
        reg_num:data.reg_num,
        gst_num:data.gst_num,
        bank_name:data.bank_name,
        bank_acc_num:data.bank_acc_num,
        bank_acc_type:data.bank_acc_type,
        bank_branch_name:data.bank_branch_name,
        is_active:data.is_active,
        mo_by:data.mo_by
    },
    where:{
        entity_id:data.entity_id,
        vendor_id:data.vendor_id,
        branch_id:data.branch_id
    }
});
return result
    }

}