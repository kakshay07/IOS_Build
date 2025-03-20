import { AxiosResponse } from "axios";
import { APISuccessResponseInterface, getCurrentDateInYYYYMMDD} from ".";
import { axios } from "./axios";
import { entityModel } from "../pages/Masters/Entity";
import { pagesModel } from "../pages/Masters/Pages";
import { branchModel } from "../pages/Masters/Branch";
import { rolesModel } from "../pages/Masters/Roles";
import { dsignationModel } from "../pages/Masters/Designation";
import { typeModel } from "../pages/Masters/Type";
import { MachineModel } from "../pages/Masters/Machine";
import { MaterialModel } from "../pages/Masters/Materials";
import { ParentProductModel } from "../pages/Masters/ParentProduct";
import { ProductModel } from "../pages/Masters/Product";
import { vendorModel } from "../pages/Masters/Vendor";
import { VehicleModel } from "../pages/Masters/Vehicle";
import { TimeShiftModel } from "../pages/Masters/TimeShift";
import { ProcurementModel } from "../pages/Entry/ProcurementEntry";
import { OperatorsModel } from "../pages/Entry/OperatorsEntry";
import { ExtrusionProductionOutputModel, MaterialModel1, productionModel } from "../pages/Entry/ExtrusionProduction";
import { RequestEntryModel } from "../pages/Entry/RequestEntry";
import { StockData, StockTransferModel } from "../pages/Entry/StockTransferApproval";
import { readingEntryModel } from "../pages/Entry/ReadingLogEntry";
import { LeadApproveOrderModel } from "../pages/SalesModel/SalesEntry";
import { additionaFeatureModel } from "../pages/Masters/AdditionalFeature";
import { KnittingProductionModel, MaterialModel_knitting } from "../pages/Entry/KnittingProduction";
// import { customerTaskManagementmodel } from "../pages/CustomerTaskManagement";
import { mainModel as AdditionalFeaturseTemplateModel } from "../pages/Masters/MessageTemplates";
import { ClippingProductionModel, MaterialModel_Clipping } from "../pages/Entry/ClippingProduction";
import { taskModel } from "../pages/TaskManagement/TaskManagement";
import { subTaskModel } from "../pages/TaskManagement/SubTaskManagement";
import { CustomerProfileModel } from "../pages/TaskManagement/CustomerProfile";
import { CustomerTaskActionModel, customerTaskManagementmodel } from "../pages/TaskManagement/CustomerTaskAction";
import { EditCustomerTaskmodel } from "../pages/TaskManagement/EditCustomerTask";
import { scheduleEventModel } from "../pages/TaskManagement/EventScheduler";
import { inwardOutwardRegistryModel } from "../pages/TaskManagement/InwardOutwardRegistry";
import { filterForCurrentDateWiseSalesAndProd, filterForSalesAndProdReportModel } from "../pages/Reports/ProductReport";



export const requestHandler = async (
  api: () => Promise<AxiosResponse<APISuccessResponseInterface, any>>,
  onSuccess: (data: APISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await api();

    if (response) {
      const { data } = response;
      if (data?.success) {
        onSuccess(data);
      } else {
        // console.log("why something went wrong")
        onError(data?.message || "Something went wrong");
      }
    }
  } catch (error: any) {
    // Handle specific known errors
    if (error.message === 'globalEntity or globalBranch is null') {
      // console.log("globalEntity error:", error.message);
    } else if (error.response?.data?.message) {
      // console.log(error.response.data)
      // Display meaningful error message
      onError(error.response.data.message);
    }
  }
};


export const checkServerIndex = () => {
  return axios.get("/");
};
export const logout=(data:{user_name:string,entity_id:number})=>{
  return axios.post('/user/logout',data);
}

export const login = (data: { user_name: string; password: string }) => {
  return axios.post("/user/login", data);
};
export const checkSession =(data:{user_name:string})=>{
  return axios.post('/user/check-active-session',data)
}
export const forceLogout =(data:{user_name:string})=>{
  return axios.post("/user/force-logout",data)
}

export const AddEntity = (data: entityModel) => {
  return axios.post("/entity", data);
};

export const GetEntity = () => {
  return axios.get("/entity");
};

export const UpdateEntity = ({
  entity_id,
  name,
  short_desc,
  address,
  reg_num,
  estab_date,
  expiry_date,
  email,
  bank_ac_num,
  bank_ifsc,
  bank_name,
  bank_location,
  gst_no,
  country,
  state,
  city,
  area,
  pincode,
  additional_info,
  phone_num,
  s3_region,
  s3_access_key_id,
  s3_secret_access_key ,
  s3_bucket_name,
  s3_cloudfront_url,
  imageFile,
  gmail_id,
  app_password
}: entityModel) => {
  const formData = new FormData();
  if (imageFile) {
    formData.append("entity_image",imageFile);
  }
  const data={
    entity_id,
    name,
    short_desc,
    address,
    reg_num,
    estab_date,
    expiry_date,
    email,
    bank_ac_num,
    bank_ifsc,
    bank_name,
    bank_location,
    gst_no,
    country,
    state,
    city,
    area,
    pincode,
    additional_info,
    phone_num,
    s3_region,
    s3_access_key_id,
    s3_secret_access_key ,
    s3_bucket_name,
    s3_cloudfront_url,
    gmail_id,
    app_password
  };
  if (data) {
    formData.append("data", JSON.stringify(data));
  }
  return axios.put("/entity", formData);
};



export const GetPages = () => {
  return axios.get("/page");
};

export const GetPagesForGivingAccess = () => {
  return axios.get("/page/toGiveAccess");
};

export const UpdatePage = ({
  page_id,
  page_name,
  name,
  description,
  superadmin_only,
  access_for_all,
  extra_actions
}: pagesModel) => {
  return axios.put("/page", {
    page_id,
    page_name,
    name,
    description,
    superadmin_only,
    access_for_all,
    extra_actions
  });
};

export const AddPage = ({ page_name, name, description, superadmin_only, access_for_all,extra_actions }: pagesModel) => {

  return axios.post("/page", {
    page_name,
    name,
    description,
    superadmin_only,
    access_for_all,
    extra_actions
  });
};


// Add roles 
export const GetRoles = (filter?:{limit:number ,page:number ,role_name:string}) => {
  return axios.get("/role",{
    params:filter
  });
};

export const addRoles = ({ role_name, page_access ,extra_actions, is_admin , level, self_all, is_external, is_superadmin , is_staff ,login_req}: rolesModel) => {
  return axios.post("/role", {role_name,page_access,extra_actions,is_admin , level, self_all, is_external, is_superadmin , is_staff ,login_req});
};
export const updateRoleAccess=({entity_id,role_id,role_name,page_access ,extra_actions, is_admin, level, self_all, is_external, is_superadmin,is_staff,login_req,is_active,cr_by,cr_on}:rolesModel)=>{
  return axios.put('/role',{
    entity_id,
    role_id,
    role_name,
    page_access,
    extra_actions,// new added
    is_admin,
    level, 
    self_all,
    is_external,
    is_superadmin, 
    is_staff,
    login_req,
    is_active,
    cr_by,
    cr_on
  })
}

//BRANCH RELATED APIS
export const GetAllBranches = (filter?:{limit:number ,page:number ,name:string}) => {
  return axios.get("/branch",{
    params:filter
  });
};

export const UpdateBranch = ({ entity_id, branch_id, name, branch_incharge_name, address1, address2, pincode, country, state, city, area, is_active }: branchModel) => {
  return axios.put("/branch", {
    entity_id,
    branch_id,
    name,
    branch_incharge_name,
    address1,
    address2,
    pincode,
    country,
    state,
    city,
    area,
    is_active
  });
};

export const getBranchByEntity = () => {
  return axios.get("/branch/getBranchByEntity");
};

export const AddBranch = (data: branchModel) => {
  return axios.post("/branch", data
 );
};

export const GetAllUsers = (filters?:{page?:number,limit:number,user_name?:string | null,role_id:number| null}) => {
  return axios.get("/user",{
    params:filters
  });
};


  
// eslint-disable-next-line react-refresh/only-export-components
export const changePassword = ({
user_password
}:{
  user_password : string
}) =>{
  return  axios.put("/user/changePassword",{
    user_password
  }
  )
}

export const UpdateProfileImg = (data: {
  entity_id: number;
  branch_id: number;
  user_name: string;
  oldImgUrl: string;
  imageFile: File | null;
}) => {
  const formData = new FormData();
  if (data.imageFile) {
    formData.append("ProfileImg", data.imageFile);
  }
  if (data) {
    formData.append("data", JSON.stringify(data));
  }
  return axios.post("/user/profileImg", formData);
};

export const addUSer = (data: {
  user_name: string | null;
  full_name: string | null;
  user_password: string | null;
  role_id: number | null;
  desig_id: number | null;
  imageFile: File | null;
}) => {
  const formData = new FormData();
  if (data.imageFile) {
    formData.append("ProfileImg", data.imageFile);
  }
  if (data) {
    formData.append("data", JSON.stringify(data));
  }
  return axios.post("/user", formData);
};

export const UpdateUser = (data: {
  user_name: string  | null;
  full_name: string  | null;
  role_id: number  | null;
  entity_id: number | null;
  user_id: number  | null;
  desig_id: number  | null;
  user_active: 0 | 1;
  user_password: string  | null;
  imageFile: File | null;
}) => {
  const formData = new FormData();
  if (data.imageFile) {
    formData.append("ProfileImg", data.imageFile);
  }
  if (data) {
    formData.append("data", JSON.stringify(data));
  }
  return axios.put("/user", formData);
};

export const getDesignations = (filter?:{limit:number ,page:number ,name:string}) => {
  return axios.get("/designation",{
    params:filter
  });
};

export const addDesignation = (data : dsignationModel) => {
  return axios.post("/designation" , {
    name : data.name
  });
};

export const updateDesignation = (data : dsignationModel) => {
  return axios.put("/designation" , data);
};

export const getAllCountriesAPI = () => {
  return axios.get('/country')
}
export const getAllStatesAPI = (country_code : string) => {
  return axios.get('/state' , {
    params : {
      country_code
    }
  })
}
export const getAllCitiesAPI = (state_code : string) => {
  return axios.get('/city' , {
    params : {
      state_code
    }
  })
}
// bank master Api
export const getAllBankName = () => {
  return axios.get('/bank')
}
export const getBankAccountType = () => {
  return axios.get('/bank/accounttype')
}

// Get pincode api for automatic populate
export const GetDataUsingPincode=(pincode:number)=>{
  return axios.get('/pincode/getdata',{
    params:{
      pincode
    }
  })
}

// === ADDITIONAL FEATURES API === 
export const GetAllAdditionalFeature = () => {
  return axios.get("/additionalfeature")
}

export const AddAdditonalFeature = (data: additionaFeatureModel) => {
  return axios.post("/additionalfeature",data)
}

export const UpadateAdditonalFeature = (data: additionaFeatureModel) => {
  return axios.put("/additionalfeature",data)
}        

export const giveAdditionalFeaturesAccessToEntity = (data: {
  features : additionaFeatureModel[],
  entity_id : number,
}) => {
  return axios.post("/additionalfeature/giveAccessToEntity",data)
}     

export const getAdditionalAccessOfEntity = (data: {
  entity_id : number,
}) => {
  return axios.get("/additionalfeature/getEntityAccess", {
    params : {
      entity_id_ : data.entity_id  
    }
  })
}   

export const UpadateAdditonalFeatureTemplate = (data: AdditionalFeaturseTemplateModel) => {
  return axios.put("/additionalfeature/updateFeatureTemplate",data)
}   

export const sendTestEmail = (data: {
  to_email : string,
  entity_id : number
}) => {
  return axios.post("/additionalfeature/sendTestEmail",data)
} 

//MASTERS APIS


export const TypesApis = {
  AddTypesData : (data:typeModel[])=>{
    return axios.post('/types',data)
  },
  GetAllTypes :(filter?:{type_name:string,limit:number,page:number})=>{
    return axios.get('/types',{
      params:filter
    })
  },
  FetchTypesByTypename :(typeName:string ,machine_name :string )=>{
    return axios.get('/types/name',{
      params:{typeName ,machine_name }
    })
  },
  FetchAllTypesName :()=>{
    return axios.get('/types/allTypes')
  },
  MarkActiveInactive:(type_name:string,is_active:number)=>{
    return axios.post('/types/status',{is_active,type_name})

  },
  UpdateTypesData :(data:typeModel[])=>{
    return axios.put('/types',data)
  }
} 

export const MachineApis = {
  AddMachines :(data:MachineModel)=>{
    const formData = new FormData();
    if (data.machineImageFile) {
      formData.append("machineImage", data.machineImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.post('/machine',formData)
  },
  GetAllMachines :(filters?:{machine_name:string,model_no?:string,machine_no?:string,limit:number,page:number})=>{
    return axios.get('/machine',{
      params:filters
    })
  },
  UpdateMachine :(data:MachineModel)=>{
    const formData = new FormData();
    if (data.machineImageFile) {
      formData.append("machineImage", data.machineImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.put('/machine',formData)
  },
  getMachinesWithNoOngoingProduction :(data: {
    machine_name : string;
    entry_date?:string
  })=>{
    return axios.get('/machine/getMachinesWithNoOngoingProduction',{
      params : {
        machine_name : data.machine_name,
        entry_date:data.entry_date
      }
    })
  },
}

export const MaterialApis = {
  GetAllMaterials:(filters?:{material_name?:string,consumed_during?:string,limit?:number,page?:number;is_color_required ?: 0 | 1})=>{
    return axios.get('/material',{
      params:filters
    })
  },
  AddMaterial :(data:MaterialModel)=>{
    const formData = new FormData();
    if (data.materialImageFile) {
      formData.append("materialImage", data.materialImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.post('/material',formData)
  },

  UpdateMaterial :(data:MaterialModel)=>{
    const formData = new FormData();
    if (data.materialImageFile) {
      formData.append("materialImage", data.materialImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.put('/material' ,formData)
  },

  GetMaterialsWithStock: ()=>{
    return axios.get('/material/getmaterialswithstock',)
  }
}


export const parentProductApis = {
  GetAllParentproductData: (filters?: {
    name?: string;
    limit?: number;
    page?: number;
  }) => {
    return axios.get("/parentproduct", {
      params: filters,
    });
  },
  AddParentProduct: (data: ParentProductModel) => {
    const formData = new FormData();
    if (data.parentImageFile) {
      formData.append("parentImage", data.parentImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.post("/parentproduct", formData);
  },
  UpdateParentProduct: (data: ParentProductModel) => {
    const formData = new FormData();
    if (data.parentImageFile) {
      formData.append("parentImage", data.parentImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.put("/parentproduct", formData);
  },
};

export const ProductApis = {
  GetAllProduct :(filters?:{product_name?:string,product_type?:string,limit?:number,page?:number,is_active?:number,machine_name?:string})=>{
    return axios.get('/product',{
      params:filters
    })
  },
  AddProduct :(data:ProductModel)=>{
    const formData = new FormData();
    if (data.productImageFile) {
      formData.append("productImage", data.productImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.post('/product',formData)
  },
  UpdateProduct:(data:ProductModel)=>{
    const formData = new FormData();
    if (data.productImageFile) {
      formData.append("productImage", data.productImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.put('/product',formData)
  },
  getProductsForAddingOutputBasedOnColorOfMasterBatch : (data:{product_type:string,is_active:number,machine_name:string,ref_num:string})=>{
    return axios.get('/product/getProductsBasedOnColorOfMasterBatch' ,{
      params : data
    })
  }
}

export const VendorApis = {
  AddVendor :(data:vendorModel)=>{
    return axios.post('/vendor',data)
  },
  UpdateVendor :(data:vendorModel)=>{
    return axios.put('/vendor' ,data)
  },
  GetAllVendor :(filters ?: { vendor_id?:number
    type?: string 
    page?: number 
    limit?: number})=>{
    return axios.get('/vendor',{
      params :filters
    })
  }
}

export const VehicleApis = {
  getAllVehicles :(filters?:{vehicle_name:string ,limit:number,page:number})=>{
    return axios.get('/vehicle',{
      params:filters
    })
  },
  AddVehicleDetails :(data:VehicleModel)=>{
    const formData = new FormData();
    if (data.vehicleImageFile) {
      formData.append("vehicleImage", data.vehicleImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.post('/vehicle',formData)
  },
  UpdateVehicle :(data:VehicleModel)=>{
    const formData = new FormData();
    if (data.vehicleImageFile) {
      formData.append("vehicleImage", data.vehicleImageFile);
    }
    if (data) {
      formData.append("data", JSON.stringify(data));
    }
    return axios.put('/vehicle',formData)
  }
}

export const ShiftTimeApis = {
  AddTimeShift :(data:TimeShiftModel)=>{
    return axios.post('/timeshift',data)
  },
  UpdateTimeShift:(data:TimeShiftModel)=>{
    return axios.put('/timeshift',data)
  },
  GetTimeShift :(filters?:{
    shift_code:string
    ,limit:number,page:number
  })=>{
    return axios.get('/timeshift',{
      params:filters
    })
  }
}

export const ProcurementApis= {
  AddProcurement :(data:ProcurementModel[])=>{
    return axios.post('/procurement',data)
  },
  GetAllProcurement :(filters?:{entry_date?:string,vendor_id?:string,limit?:number,page?:number})=>{
    return axios.get('/procurement',{
      params : filters
    })
  },
  fetchItemRelToRefNum :(ref_num:string)=>{
    return axios.get('/procurement/refNum',{
      params:{ref_num}
    })
  },
  fetchAllItemsForUpdationOnRefNum :(ref_num:string)=>{
    return axios.get('/procurement/refNum/update',{
      params :{ref_num}
    })
  },
  UpdateProcurement :(data:{
    id: number, //MATERIAL ID
    entry_date: string,
    vendor_id: number,
    invoice_num: string,
    quantity: number,
    unit: string,
    code:string,
    make:string;
    sl: number,
    ref_num:string,
    is_lot_required: number,
    lot_p_count:number | null ,
    isEdited :boolean
  }[])=>{
    return axios.put('/procurement',data)
  },
  fetchLotNumForPrintingLabelUsingRefNum:(ref_num:string)=>{
    return axios.get('/procurement/print',{
      params :{ref_num}
    })
  }
}


export const OperatorApis = {
  AddOperators: (data: OperatorsModel[]) => {
    return axios.post("/operator", data);
  },
  GetAllOperator: (filters?: {
    machine_name?: string;
    // shift_code?: string;
    // operator_name?: number | null;
    from_date:string;
    to_date:string;
    selectedTab?: string;
    limit?: number;
    page?: number;
  }) => {
    return axios.get("/operator", {
      params: filters,
    });
  },
  getOperatorsOfAMachine: (filters?: {
    machine_name : string,
    machinde_identity_no : string,
    entry_date : string,
    shift_code: string
  }) => {
    return axios.get("/operator/getOperatorOfAMachine", {
      params: filters,
    });
  },
  UpdateOperator: (data: OperatorsModel[]) => {
    return axios.put("/operator", data);
  },
  AddOperationalGap: (data: OperatorsModel) => {
    return axios.post("/operator/addgap", data);
  },
  GetdatausingMachineIdentityNo :(machine_identity_no : string)=>{
    return axios.get('/operator/machineIdentity',{
      params : {machine_identity_no}
    })
  },
  AddUpTime :(data:OperatorsModel)=>{
    return axios.post('/operator/addUpTime',data)
  },
  GetDownTimeHistory :()=>{
    return axios.get('/operator/getDownTimeHistory')
  },
  GetHistoryOfOperator :()=>{
    return axios.get('/operator/getOperatorsHistory')
  }
};


export const productionApis = {
  getAllMaterialsUsedForExtrusion: (data: {
    production_qty : number,
    entry_date:string
  }) => {
    return axios.get("/production/getMaterialsUsedForExtrusionWithQuantityEstimation", {
      params : {
        ...data
      }
    });
  },
  getStockOfALot: (data: {
    lot_no : number,
    material_id : number,
    entry_date:string
  }) => {
    return axios.get("/production/getProductionStockOfALot", {
      params : {
        ...data
      }
    });
  },
  addExtrusionConsumption: (data: MaterialModel1[], data2 : productionModel) => {
    return axios.post("/production/addConsumptionOfExtrusion", {
      materials_details : data,
      production_details : data2
    });
  },
  addExtrusionOutput: (data: ExtrusionProductionOutputModel[], production_details : {
    ref_num : string,
    machine_identity_no : string
  }) => {
    return axios.post("/production/addExtrusionProductionOutput", {
      output_details : data,
      production_details 
    });
  },
  getAllExtrusionProductions: (filters ?: {
    page : number,
    limit : number,
    start_date ?: string,
    product_id ?: string,
  }) => {
    return axios.get("/production/getAllEntrusionProductions",{
      params : {...filters}
    });
  },
  getAllExtrusionProductionOutputs: (data : {
    ref_num : string
  }) => {
    return axios.get("/production/getAllExtrusionOutputs" , {
      params : {
        ref_num : data.ref_num
      }
    });
  },
  getAllExtrusionProductionInputs: (data : {
    ref_num : string
  }) => {
    return axios.get("/production/getAllExtrusionInputs" , {
      params : {
        ref_num : data.ref_num
      }
    });
  },

  GetQrForLotNumbersUsingRefNum:(ref_num :string)=>{
    return axios.get('/production/getQrCode',{
      params :{
        ref_num
      }
    })
  },
  GetProductionLogSheet :(ref_num :string ,entry_date:string)=>{
    return axios.get('/production/getProductionLogSheet',{
      params : {
        ref_num,
        entry_date
      }
    })
  },
  GetFilmExtrusionOutputFormatDatas : (entry_date:string)=>{  
    return axios.get('/production/getFilmExtrusionOutputFormatData',{
      params : {
        entry_date
      }
    })
  }
};


export const RequestEntryApis = {
  GetAllRequestEntry: (filters?: {
    entry_date?: string;
    selectedTab?: string;
    limit?: number;
    page?: number;
  }) => {
    return axios.get("/requestentry", {
      params: filters,
    });
  },

  AddRequestEntry: (data: RequestEntryModel[]) => {
    return axios.post("/requestentry", data);
  },

  UpdateRequestEntry: (data: RequestEntryModel[]) => {
    return axios.put("/requestentry", data);
  },

  GetViewOrEditData: (entity_id: number, branch_id: number, request_id: number) => {
    return axios.get("/requestentry/getvieworeditdata", {
      params: {
        entity_id,
        branch_id,
        request_id
      },
    });
  },
};

export const TransferApprovalApis = {
  AllRequestEntries: (filters?: {
    entry_date?: string;
    selectedTab?: string;
    limit?: number;
    page?: number;
  }) => {
    return axios.get("/stocktransferapproval", {
      params: filters,
    });
  },

  GetStockUsingLotNum: (lot_no: string) => {
    return axios.get("/stocktransferapproval/getstockusinglotnum", {
      params: {
        lot_no
      },
    });
  },

  UpdateApprovalStock: (data: Record<string, StockData[] | undefined>, approvalDate: string) => {
    return axios.post("/stocktransferapproval/updatetransferapprovalstock", {data, approvalDate});
  },

  GetApprovedStocks: (entity_id: number, branch_id: number, ref_num: string) => {
    return axios.get("/stocktransferapproval/getapprovedstocks", {
      params: {
        entity_id,
        branch_id,
        ref_num
      },
    });
  },

  UpdateManualApprovalStock: (data: StockTransferModel[], approvalDate: string) => {
    return axios.post("/stocktransferapproval/updatemanualtransferapprovalstock", {data, approvalDate});
  },
};

export const ReadinglogApi = {
  AddReadinglog : (data:readingEntryModel[])=>{
    return axios.post('/readinglog' ,data)
  },
  GetAllRecordsOnEntryDate :(parameter ?:{selectedDate:string,selectedMachineTab:string })=>{
    return axios.get('/readinglog',{
      params :parameter
    })
  },
  GetAllLastModifiedDateOfMAchines : (parameter ?:{selectedDate:string,selectedMachineTab:string }) =>{
    return axios.get('/readinglog/getlastmodifieddate',{
      params :parameter
    })
  },
  
 GetDataForExcellDownload  : (data : { 
  machine_name : string,
  from_date : string,
  to_date : string,
 })=>{
  return axios.get('/readinglog/getdataforexcelldownload',{
    params:data
  })
}
}





// ==== KNITTING PRODUCTION API====/

export const KnittingProductionApis = {
  GetAllSemiFinishedProductAndMaterialForKnitting: (data: {
    product_id: number;
    entry_date: string;
  }) => {
    return axios.get("/knittingproduction/semiFinishedProductAndMaterial", {
      params: {
        ...data,
      },
    });
  },
  GetStockOfALot: (data: {
    lot_no: string;
    id: number;
    type: "semiProduct" | "material" | string;
    entry_date: string;
  }) => {
    return axios.get("/knittingproduction/getlotStock", {
      params: {
        ...data,
      },
    });
  },
  AddConsumptionOfMaterialAndSemiProduct: (
    data: MaterialModel_knitting[],
    otherDatas: KnittingProductionModel
  ) => {
    return axios.post("/knittingproduction/addconsumptionofknitting", {
      materials_product_details: data,
      othersData: otherDatas,
    });
  },
  AddConsumptionOfBobbinsLikeMaterial :(data:KnittingProductionModel)=>{
    return axios.post('/knittingproduction/addconsumptionofbobbins',data)
  },
  GetAllKnittingProductionDetail: (filter?: {page?: number; limit?: number,machine_identity_no?:string,start_date?:string,product_id:string}) => {
    return axios.get("/knittingproduction/getknittingprodData",
      {params: filter}
    );
  },
  GetNoOfNettingRollsForRefNum: (ref_num: string ,code :string) => {
    return axios.get("/knittingproduction/noOfNetRoll", {
      params: { ref_num ,code},
    });
  },
  AddFinalOutputOfKnittingProduction: (
    data: {
      qauntity_rows: {
        quantity: number | null;
        length: number | null;
      }[];
      ref_num: string;
      machine_identity_no: string;
      product_id: number | null;
      machine_runtime: number | null;
      identifier: number;
      entry_date: string | null;
      total_damage: number | null;
      yarn: string | null;
      shift_code: string | null;
      // new added after finding bug in code by chirantana factory
      code :string; //N or P
    },
    Rawmaterial: {
      material_id: number;
      quantity: number;
      stock: number;
    }[]
  ) => {
    return axios.post("/knittingproduction/addFinalOutputForKnittingProduction", {
      data:data,
      Rawmaterial :Rawmaterial
    });
  },
  GetQrCodeForLotNumbersUsingRefNum: (ref_num: string) => {
    return axios.get("/knittingproduction/GenerateQrCode", {
      params: {
        ref_num,
      },
    });
  },
  GetInputRawMaterialsDetailsForView: (ref_num: string, flag: string) => {
    return axios.get("/knittingproduction/ViewInputOutput", {
      params: { ref_num, entry_type: flag },
    });
  },
  GetOutputViewOfProductFormed: (ref_num: string) => {
    return axios.get("/knittingproduction/Output", {
      params: { ref_num },
    });
  },
  checkIfEntryDateAndShiftMatchesInDb: (data: {
    ref_num: string;
    machine_identity_no: string;
    shift_code: string;
    entry_date: string;
  }) => {
    return axios.get("/knittingproduction/checkIfDateShiftExists", {
      params: {
        ...data,
      },
    });
  },
  RawMaterailUsedInKnittingProductionLikePaperCore: (data: { // only paper core not bobbins , bobbins used in consumption during addproduction
    entry_date: string;
  }) => {
    return axios.get("/knittingproduction/rawmaterialList", {
      params: { ...data },
    });
  },
};


export const ClippingProductionApis ={
  GetAllConsumingFinalProductAndMaterialListForClippingProduct :(data:{product_id:number,entry_date:string})=>{
    return axios.get('/clippingproduction/getfinalProductAndMaterial' ,{
      params :{
        ...data
      }
    })
  },
  GetStockOfALot :(data:{
    id: number
    lot_no: string,
    type ?:string,
    entry_date:string
  })=>{
    return axios.get('/clippingproduction/getstockforpassedLotNumber',{
      params:{
        ...data
      }
    })
  },
  AddConsumptionOfMaterialAndFinalProductofClipping :(data:MaterialModel_Clipping[], otherDatas :ClippingProductionModel)=>{
    return axios.post('/clippingproduction/addClippingConsumption',{
      materials_product_details : data,
      othersData : otherDatas
    })
  },
  GetAllClippingProductiondataDetails :(filters ?: {
    product_id : string;
    machine_identity_no :string;
    limit : number;
    page:number;
  })=>{
    return axios.get('/clippingproduction' , {
      params : {
        ...filters
      }
    })
  },
  AddFinalOutputOfClippingProduction :(data:{
  ref_num: string ;
  machine_identity_no:string;
  product_id: number | null;
  machine_runtime: number | null;
  entry_date: string | null;
  quantity: number | null;
  pieces_count:number;
  })=>{
    return axios.post('/clippingproduction/addOutput',data)
  },
  GetRawMaterialsAndProductDetailsForView:(ref_num:string,entry_type :string)=>{
    return axios.get('/clippingproduction/ViewInputOutput',{
      params:{
        ref_num,
        entry_type
      }
    })
  },
  GetQrCodeForLotNumbersUsingRefNum :(ref_num:string)=>{
    return axios.get('/clippingproduction/GenerateQrCode',{
      params :{
        ref_num
      }
    })
  }
}


//Task Management api's
export const getTasks = (filter?: {task_desc: string; limit: number; page: number}) => {
  return axios.get("/taskmanagement", {
    params: filter
  });
};

export const addTasks = (data : taskModel) => {
  return axios.post("/taskmanagement", data);
};

export const updateTasks = (data : taskModel) => {
  return axios.put("/taskmanagement", data);
};


//Sub Task Management api's
export const getSubTasks = (filter?: {sub_task_desc: string; limit: number; page: number}) => {
  return axios.get("/subtaskmanagement", {
    params: filter
  });
};

export const addSubTasks = (data : subTaskModel) => {
  return axios.post("/subtaskmanagement", data);
};

export const updateSubTasks = (data : subTaskModel) => {
  return axios.put("/subtaskmanagement", data);
};

export const getTasksForSubTask = () => {
  return axios.get("/subtaskmanagement/gettasks");
};


//Customer profile Api's
export const GetAllCustomerData=(filters?:{limit:number,page:number,selectedTab?:string, cust_mobile_num1?:string,
  cust_name_filter ?: string})=>{
  return axios.get('/customerprofile',{
    params : 
      filters
  })
}
export const AddCustomerprofileInfo=(data:CustomerProfileModel)=>{
  return axios.post('/customerprofile' , {data})
}
export const UpdateCustomerProfileInfo=(data:CustomerProfileModel)=>{
  return axios.put('/customerprofile' , {data})
}


// Customer task management api's
export const getAllCustomerTask = (filter: {cust_mobile_num1?: string , cust_name?: string; limit?: number; page?: number}) => {
  return axios.get("/customertaskmanagement",{
    params:filter
  }) 
}

export const getAllCustomertaskforView = (entity_id: number, branch_id: number, cust_id: number, cust_task_id: number) => {
  return axios.get("/customertaskmanagement/view",{
    params:{
      entity_id,
      branch_id,
      cust_id,
      cust_task_id
    }
  }) 
}

export const addCustomerTask = (cust_id:number, is_group: number, group_leader_id: number,
  newDataArray:{
    user_id:number,
    task_id:number,
    sub_task_id :number,
    start_date:string,
    end_date: string,
    additional_desc:string,
    priority: string,
    task_deadline_date: string,
    check_file: string
  }[]
) => {
  return axios.post("/customertaskmanagement",
    {cust_id, is_group, group_leader_id, newDataArray}
  )
}

export const updateCustomertask = (
  main_data: {
    cust_id:number,
    cust_task_id:number,
    group_leader_id: number | null
  }, 
  newDataArray:{
    user_id:number,
    task_id:number,
    sub_task_id :number,
    start_date:string,
    end_date: string,
    is_disabled:0 | 1,
    additional_desc :string,
    priority: string,
    task_deadline_date: string,
    check_file: string,
    closure_date:string | null,
    invoice_num:string | null
    invoice_date:string | null,
    invoice_amount:number | null,
    receipt_date:string | null,
    payment_amount: number | null,
    mode_of_payment:string | null,
    reference_num:string | null,
    instrument_date:string | null,
    clearing_date:string | null,
    bank_name:string | null,
    bank_branch:string | null,
    raise_invoice:0 | 1 | null,
    raise_invoice_date: string | null,
    raise_payment: 0 | 1 | null,
    raise_payment_date:string | null,
    sort_task:string | null 
}[]
) => {
  return axios.post("/customertaskmanagement/update",
    {main_data, newDataArray}
  )
}

export const getsubtaskByTask = (task_id:number) => {
  return axios.get("/customertaskmanagement/task_id",{
    params:{task_id}
  })
}
export const UpdateActiveInactiveStatus=(data:{entity_id:number,branch_id:number,cust_id:number,cust_task_id:number,sl:number,is_disabled:0 | 1})=>{
  return axios.post('/customertaskmanagement/disableTask',data)
}

export const uploadFileToCheckForStaff = (check_file: File | null) => {
  const formData = new FormData();

  if(check_file)
  {
    formData.append("file", check_file);
  }
  return axios.post("/customertaskmanagement/uploadfiletocheckforstaff", formData);
};

export const GetAllCustomers=()=>{
  return axios.get('/customerprofile/getallcustomers')
}



//Edit customer task & Notification bell icon's count api's
export const getEditCustomerTask = () => {
  return axios.get("/editcustomertask");
};

export const UpdatecustomerTask = (data : EditCustomerTaskmodel, action_for: string) => {
  return axios.put("/editcustomertask", {...data, action_for});
};

export const GetInvoiceNull = () => {
  return axios.get('/editcustomertask/invoicenull')
}

export const getreceiptnotification = () => {
  return axios.get('/editcustomertask/getreceiptnotification')
}

export const getduedatenotification = () => {
  return axios.get('/editcustomertask/gettaskduedatecount');
}

export const getassignedtasknotification = () => {
  return axios.get('/editcustomertask/getassignedtaskcount');
};



// Customer task action api's
export const getTasksByUserId = (filters?: {page: number, limit: number, raise_invoice: string, raise_payment: string, due_date: string, user_id: string, invoice_date?: string, receipt_date?: string, frequency?: string, cust_id?: number | null, expired_task?: string, additional_desc?: string, group_id?: string, order_by?: string, selectedTab?: string}) => {
  return axios.get("/customertaskaction", {
    params: filters
  });
};

export const takeActionOntask = (data: CustomerTaskActionModel) => {
  const formData = new FormData();

  if (data.filesArray) {
    data.filesArray.forEach((_, index) => {
      if(_.file_data)
      {
        formData.append(`filesArray[${index}][file_data]`, _.file_data);
        formData.append(`filesArray[${index}][file_description]`, _.file_description);
      }
      

    });
  }

  formData.append("data", JSON.stringify(data));

  return axios.post("/customertaskaction/takeactionontask", formData);
};

export const getTaskActions = (data: customerTaskManagementmodel) => {  
  return axios.get("/customertaskaction/gettaskactions", {
    params: data
  });
};

export const viewTaskActionFiles = (data: customerTaskManagementmodel) => {  
  return axios.get("/customertaskaction/gettaskactionfiles", {
    params: data
  });
};

export const deleteFile = (data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
  action_sl: number | null;
  file_sl: number | null;
  file_data : string;
  file_description : string;
}) => {  
  return axios.post("/customertaskaction/deletefile", data);
};

export const uploadExtraFile = (data: {anofile: File | null; anoFile_desc: string;}, keyData: customerTaskManagementmodel) => {
  const formData = new FormData();

  if(data.anofile)
  {
    formData.append("file1", data.anofile);
    formData.append("file_desc", data.anoFile_desc);
  }
    
  if (keyData) {
    formData.append("key_data", JSON.stringify(keyData));
  }

  return axios.post("/customertaskaction/addextrafiles", formData);
};

export const raiseInvOrPay = (val: string, data: customerTaskManagementmodel) => {  
  return axios.post("/customertaskaction/raiseinvoiceorpayment", {...data, val});
};

export const closeTask = (data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
}) => {  
  return axios.post("/customertaskaction/closeselectedtask", {...data});
};

export const revertTask = (data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
}) => {
  return axios.post("/customertaskaction/revertselectedtask", {...data});
};

export const verfiyFiles = (val: string, data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
  action_sl: number | null;
  file_sl: number | null;
}) => {  
  return axios.post("/customertaskaction/verifyuploadedfiles", {...data, val});
};


export const markInProgress = (val: string, data: customerTaskManagementmodel) => {  
  return axios.post("/customertaskaction/markinprogresstask", {...data, val});
};

export const markCompletedTask = (val: string, data: customerTaskManagementmodel) => {  
  return axios.post("/customertaskaction/marktaskcompleted", {...data, val});
};

export const appRejAction = (val: string, data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
  action_sl: number | null;
}) => {  
  return axios.post("/customertaskaction/approverejectaction", {...data, val});
};

export const updateRemarks = (data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
  action_sl: number | null;
  asignee_remarks: string;
}) => {  
  return axios.post("/customertaskaction/updateasigneeremarks", {...data});
};

export const updateAdditionalDesc = (data: {
  entity_id: number | null;
  branch_id: number | null;
  cust_id: number | null;
  cust_task_id: number | null;
  sl: number | null;
  additional_desc: string;
}) => {  
  return axios.post("/customertaskaction/updateadditionaldescription", {...data});
};

export const deleteTaskPermanently = (data: customerTaskManagementmodel) => {  
  return axios.get("/customertaskaction/deletecustomertask", {
    params: data
  });
};

export const GetAllGroups=()=>{
  return axios.get('/customertaskaction/getallgroups');
}


//Login report dashboard/screen api's
export const getAllUserLoginTime = (filter?: {user_id: string; limit: number; page: number}) => {
  return axios.get("/user/getalluserslogintime", {
    params: filter
  });
};


//Event scheduler api's
export const getScheduledEvents = (filter?: {event_date: string; limit: number; page: number}) => {
  return axios.get("/eventscheduler", {
    params: filter
  });
};

export const scheduleEvent = (data : scheduleEventModel) => {
  return axios.post("/eventscheduler", data);
};

export const updateScheduledEvent = (data : scheduleEventModel) => {
  return axios.put("/eventscheduler", data);
};

export const deleteEvent = (entity_id: number | null, branch_id: number | null, user_id: number | null, event_sl: number | null) => {
  return axios.delete("/eventscheduler", {
    params:{
      entity_id,
      branch_id,
      user_id,
      event_sl
    }
  });
};



//Inward outward registry api's
export const getRegistry = (filter?: {cust_id: string; receipt_date: string; limit: number; page: number}) => {
  return axios.get("/inwardoutwardregistry", {
    params: filter
  });
};

export const addRegistry = (data: inwardOutwardRegistryModel) => {
  const formData = new FormData();

  if (data.registry_file) {
    formData.append("registry_file", data.registry_file);
  }
  if (data) {
    formData.append("data", JSON.stringify(data));
  }
  
  return axios.post("/inwardoutwardregistry", formData);
};

export const updateRegistry = (data : inwardOutwardRegistryModel) => {
  const formData = new FormData();

  if (data.registry_file) {
    formData.append("registry_file", data.registry_file);
  }
  if (data) {
    formData.append("data", JSON.stringify(data));
  }

  return axios.put("/inwardoutwardregistry", formData);
};



export const MaterialReportsApis = {
  getMaterialsCurrentStockStoreAndProductionStore :()=>{
    return axios.get('/material/materialsCurrentStockStoreAndProductionStore')
  },
  GetOpeningAndClosingBalanceOfMaterials : (data?:{from_date?:string,to_date?:string ,limit:number ,page:number})=>{
    const todaysDate = getCurrentDateInYYYYMMDD()
    return axios.get('/material/openingAndClosingBalanceOfMaterials',{
      params :{
        ...data,
        todaysDate
      }
    })
  }
}
//Product Stock Report API's
export const getProductCurrentStock=()=>{
  return axios.get('/product/getCurrentStock')
}

export const getProductSalesAndProdDetails=(filter : filterForSalesAndProdReportModel)=>{
  const todaysDate = getCurrentDateInYYYYMMDD()
  return axios.get('/product/getSalesAndProdDetails' , {
    params : {...filter , todaysDate}
  })
}

export const getCurrentDateProductSalesAndProdDetails=(filter:filterForCurrentDateWiseSalesAndProd)=>{
  const todaysDate = getCurrentDateInYYYYMMDD()
  return axios.get('/product/getDateSalesAndProdDetails',{
    params : {...filter , todaysDate}
  })
}

export const GetVendorForProductSales =(date:string,id:number)=>{
  return axios.get('/product/getVendorForSales',{
    params:{date , id}
  })
}

//Stock transfer report
export const getStockTransferReport = (filter:{from_date: string, to_date: string, limit: number, page: number})=>{
  return axios.get('/stocktransferapproval/getStockTransferReport',{
    params: {...filter}
  })
}
export const SalesLeadApis = {
  AddSalesLeadEntry: (
    a: {
      entry_date: string;
      customer_type: string;
      name: string | "";
      address_1: string;
      phone: string;
      email: string;
      gst_num: number | null;
      poc_name: string;
      poc_phone: string;
      pincode: number | "";
      country: string;
      state: string;
      city: string;
      area: string;
      vendor_id: string | null;
    },
    b:{
      product_id: number
      quantity: number 
      unit: string 
      delivery_date: string 
      mode_of_contact: string 
      remark:string;
    }[]
  ) => {
    return axios.post("/SalesLead/addSalesLeadEntry", {
      data1: a,
      data2: b,
    });
  },
  GetAllSalesLeadData : (filters ?: {vendor_id ?: string ,cr_by ?:string,entry_date ?:string;page?:number,limit?:number,Tab?:string})=>{
    const SelectedTab = filters?.Tab == 'YetToApprove' ? 'YT' : 'A'
    return axios.get('/SalesLead/getAllSalesLeadData',{
      params : {...filters ,SelectedTab}
    })
  },
  FetchItemRelatedToReferenceNum :(ref_num : string)=>{
    return axios.get('/SalesLead/refNum',{
      params : {
        ref_num
      }
    })
  },
  UpdateSalesLead :(data:any[])=>{
    return axios.put('/SalesLead/update',{data})
  },
  FetchItemRelatedToReferenceNumWithStocks :(ref_num : string)=>{
    return axios.get('/SalesLead/refNumWithStocks',{
      params : {
        ref_num
      }
    })
  },
  GetCRBYForDropDown :(filtr?:{crby_aoby?:string})=>{
    return axios.get('/SalesLead/getCrBy',{
      params :filtr
    })
  }
};

//Film Roll report
export const getFilmRollReport = (filter: {from_date: string, to_date: string, limit: number, page: number}) => {
  return axios.get('/product/getFilmRollReport',{
    params: {...filter}
  })
}

//Knitted Roll report(metre)
export const getKnittedRollMetreReport = (filter: {from_date: string, to_date: string, limit: number, page: number}) => {
  return axios.get('/machine/getKnittedRollMetreReport', {
    params: {...filter}
  })
}

//Knitted Roll report(KG)
export const getKnittedRollKgReport = (filter: {from_date: string, to_date: string, limit: number, page: number}) => {
  return axios.get('/machine/getKnittedRollKgReport', {
    params: {...filter}
  })
}

//Clipping report
export const getClippingReport = (filter: {from_date: string, to_date: string, limit: number, page: number}) => {
  return axios.get('/machine/getClippingReport', {
    params: {...filter}
  })
}
export const LeadApproveRelatedAPIS = {
  ApproveSpecificOrderBasedOnLeadRefNum :(data:{
    ref_num :string;
    checked :boolean;
  } )=>{
    return axios.post('/SalesLead/ApproveOrderOfLeadRefNum',{},{
      params :{
        ...data
      }
    })
  }
}

export const SalesApis ={
  AddSalesDetailsOfApprovedOrderOFSalesLead : (data:LeadApproveOrderModel[],sales_date :string)=>{
    return axios.post('/sales',{data :data,sales_date})
  },
GetAllApprovedAndSoldDataBySelectedTab :(filters?:{selectedTab ?:string ,sale_date?:string,entry_date?:string,vendor_id :string,cr_by?:string,approved_by?:string,limit?:number,page?:number}) =>{ // this api is same as Getallsaleslead but here im sepertaed to get sold out data so thats why i made differenet apis
    return axios.get('/sales/getAllSalesLeadData',{
      params :{...filters}
    })
  },
  FetchFinishedSalesOrSoldOrderForViewOnly :(ref_num :string)=>{
    return axios.get('/sales/getsoldoutdatausingrefNum',{
      params : {
        ref_num
      }
    })
  }
  // GetAllSalesLists : (filters?: {
  //   entry_date ?:string;
  //   vendor_id?:string;
  //   invoice_num?:string;
  //   limit?: number;
  //   page?: number;
  // })=>{
  //   return axios.get('/sales',{
  //     params :filters
  //   })
  // },
  // GetDataForViewAndEdit : (ref_num:string)=>{
  //   return axios.get('/sales/refNum',{
  //     params :{ref_num}
  //   })
  // },
  // UpdateSalesDetails : (data:SalesModel[])=>{
  //   return axios.put('/sales',data)
  // }
}

