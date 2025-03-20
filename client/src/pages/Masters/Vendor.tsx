import { ChangeEvent, useEffect, useState } from "react";
import { toastError, toastSuccess } from "../../utils/SweetAlert";
import {
  GetDataUsingPincode,
  requestHandler,
  VendorApis,
} from "../../utils/api";
import Button, {
  ActionButtonGroup,
  AddButton,
  FilterButton,
  FilterResetButton,
} from "../../components/Button/Button";
import SelectField from "../../components/Select/Select";
import InputField from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import useTable from "../../components/Table/Table";
import { useMaster } from "../../contexts/MasterContext";
import { useFormField as useFieldAttributes } from "../../hooks/form";
import { useForm } from "react-hook-form";
import { VendorType } from "../../utils/Constant";

class extras {
  areas?: string[] = [];
}

export class vendorModel extends extras {
  entity_id: number | string | null = null;
  branch_id: number | string | null = null;
  vendor_id: number | null = null;
  name: string | null = null;
  type: string | null = null;
  is_outsource: 1 | 0 = 0; //new added 12-08-24 dropdown
  address_1: string | null = null;
  country: string | null = null;
  state: string | null = null;
  city?: string | null = null;
  area?: string;
  pincode?: string | null = null;
  phone: string | null = null;
  email?: string | null = null;
  reg_num?: string | null = null;
  gst_num?: string | null = null;
  poc_name?: string | null = null;
  poc_phone?: string | null = null;
  bank_name?: string | null = null;
  bank_acc_num?: string | null = null;
  bank_acc_type?: string | null = null;
  bank_branch_name?: string | null = null;
  is_active?: 1 | 0 = 1;
  cr_on?: string | number | null = null;
  cr_by?: string | number | null = null;
  mo_on?: string | number | null = null;
  mo_by?: string | number | null = null;
}

export class filterType {
  vendor_id?: number;
  type: string = "";
  page: number = 0;
  limit: number = 15;
}

export const Vendor = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<vendorModel>();
  const getFieldAttributes = useFieldAttributes({ register, errors });
  const [dataArray, setdataArray] = useState<vendorModel[]>([]);
  const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
  const [modalOpen, setmodalOpen] = useState(false);
  const {
    allCountries,
    getStates,
    allStates,
    getCities,
    allCities,
    bankName,
    bankAccType,
  } = useMaster();
  const [vendor, setVendor] = useState<vendorModel[]>([]);

  const country_watch = watch("country");
  const state_watch = watch("state");
  const VendorTypeWatch = watch("type");
  const AreaWatch = watch("areas");

  const { Table, page, setPage } = useTable(() => {
    getAllVendor();
  });

//   FILTER
const {
    register: filterRegister,
    handleSubmit: handleFilterSubmit,
    reset: filterReset,
    getValues,
    watch :LimitWatch
  } = useForm<filterType>({
    defaultValues:  new filterType(), //provide default values for filter using defaultValues
  });
  const getFilterAttributes = useFieldAttributes({
    register: filterRegister,
    errors,
  });
  const limitwatch =LimitWatch('limit')
  
  //for reseting ststaes
  function resetFilterStates() {
    filterReset(new filterType());
    getAllVendor()
  }
  
  const onFilterFormSubmit = (formData: filterType) => {
    // setPage(0);
    requestHandler(
        async () => {
          return await VendorApis.GetAllVendor({
            ...formData,
            page: Number(page),
          });
        },
        (data) => {
          setdataArray(data.data);
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
  };

  function modalClose() {
    setmodalOpen(false);
    resetDatastate();
  }
  function resetDatastate() {
    reset(new vendorModel());
  }

  function getAllVendor() {
    const filters =getValues()
    requestHandler(
      async () => {
        return await VendorApis.GetAllVendor({
          ...filters,
          page: Number(page),
        });
      },
      (data) => {
        setdataArray(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }

  function getVendor() {
    requestHandler(
      async () => {
        return await VendorApis.GetAllVendor();
      },
      (data) => {
        setVendor(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }

  const onFormSubmit = (formData: vendorModel) => {
    if (action == "Add") {
      if (VendorTypeWatch == "S") {
        (formData.bank_acc_num = ""),
          (formData.bank_acc_type = ""),
          (formData.bank_branch_name = ""),
          (formData.bank_name = "");
        formData.is_outsource = 0;
      }
      requestHandler(
        async () => {
          return await VendorApis.AddVendor(formData);
        },
        (data) => {
          if (data.success) {
            toastSuccess.fire({
              title: data.message,
            });
            getAllVendor();
            setmodalOpen(false);
            resetDatastate();
            getVendor();
          }
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    } else if (action == "Edit") {
      requestHandler(
        () => {
          return VendorApis.UpdateVendor(formData);
        },
        (data) => {
          toastSuccess.fire({
            title: data.message,
          });
          getAllVendor();
          setmodalOpen(false);
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    }
  };

  function handleGetDataUsingPincodeOnchange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const pincode = e.target.value;
    reset((prevData: vendorModel) => ({
      ...prevData,
      pincode: String(pincode),
    }));
    // Call API only when pincode length is 6
    if (pincode.length == 6) {
      requestHandler(
        async () => {
          return await GetDataUsingPincode(Number(pincode));
        },
        (data) => {
          if (data.data == "")
            reset((prev: vendorModel) => ({ ...prev, city: "", state: "" }));
          const { city_code, state_code, country_code } = data.data[0];
          const areas = data.data.map((item: any) => item.area);

          getStates(country_code);
          getCities(state_code);
          setTimeout(() => {
            reset((prev) => ({
              ...prev,
              city: city_code,
              state: state_code,
              country: country_code,
              area: areas[0],
              areas: areas,
            }));
          }, 400);
          
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    }
  }

  useEffect(() => {
    getAllVendor();
    getVendor();
  }, [page]);

  useEffect(() => {
    if (action === "Edit" || action === "View") {
      if (country_watch) {
        getStates(country_watch); // Load states based on the selected country
      }
      if (state_watch) {
        getCities(state_watch); // Load cities based on the selected state
      }
    }
  }, [action, country_watch, state_watch]);


  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Vendor
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                setmodalOpen(true);
              }}
            >
              Add Vendor
            </AddButton>
          </div>
        </div>

        <hr className="my-3 border-gray-300 " />
        <form
          noValidate
          onSubmit={handleFilterSubmit(onFilterFormSubmit)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            
            <SelectField
              name="vendor"
              label="Vendor"
              {...getFilterAttributes("vendor_id")}
            >
              <option value="">Select vendor</option>
              {vendor
                .map((_, index) => (
                  <option key={index} value={_.vendor_id?.toString()}>
                    {_.vendor_id} - {_.name}
                  </option>
                ))}{" "}
            </SelectField>

            <SelectField
              name="type"
              label="Vendor type"
              {...getFilterAttributes("type")}
            >
              <option value="">Select type</option>
              <option value="P">Procurement</option>
              <option value="S">Sales</option>
            </SelectField>

            <InputField
                {...getFilterAttributes('limit',{
                    onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                    filterReset((prev) => ({
                        ...prev,
                        limit: Number(e.target.value),
                    }))
                    }
                })}
              label="Page limit"
              name="limit"
              type="number"
              placeholder="Limit"
            />
            <div className="flex ">
              <FilterResetButton
                type="button"
                onClick={() => {
                    resetFilterStates();
                    setPage(0);
                }}
              ></FilterResetButton>
              <FilterButton onClick={() => {}}></FilterButton>
            </div>
          </div>
        </form>
      </div>

      {/* ===== Table ===== */}
      <Table pagination>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Vendor name</th>
            <th>Vendor type</th>
            <th>Phone</th>
            <th>Point of contact</th>
            <th>GST no.</th>
            <th>Is active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, i) => (
            <tr key={i}>
              <td>{ page*limitwatch+(i + 1)}</td>
              <td title= {String(_.vendor_id)} >
                <b>
                  {_.name}
                </b>
              </td>
              <td>
                {VendorType.filter((vt) => vt.key == _.type)[0].key == "P" ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-green-300 px-2.5 py-0.5 text-black-200">
                    <p className="whitespace-nowrap text-sm">Procurement</p>{" "}
                    {_.is_outsource == 1 && (
                      <span className="rounded-full bg-purple-300 px-2.5 py-0.5 text-black-200 ml-2">
                        Outsource
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-full bg-orange-300 px-2.5 py-0.5 text-black-200">
                    <p className="whitespace-nowrap text-sm">Sales</p>
                  </span>
                )}
              </td>
              <td>{_.phone}</td>
              <td>
                {_.poc_name} - {_.poc_phone}
              </td>
              <td>{_.gst_num}</td>
              <td>{_.is_active == 1 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-300 px-2.5 py-0.5 text-black-700">
                        <p className="whitespace-nowrap text-sm">Yes</p>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-orange-300 px-2.5 py-0.5 text-black-700">
                        <p className="whitespace-nowrap text-sm">No</p>
                      </span>
                    )}
              </td>
              <td>
                <ActionButtonGroup
                  onView={() => {
                    setaction("View");
                    reset((prevData) => ({
                      ...prevData,
                      ..._,
                      areas: _.area ? [_.area] : [], // Ensure `areas` is set correctly
                    }));
                    if (_.country) getStates(_.country);
                    if (_.state) getCities(_.state);
                    setmodalOpen(true);
                  }}
                  onEdit={() => {
                    setaction("Edit");
                    reset((prevData) => ({
                      ...prevData,
                      ..._,
                      areas: _.area ? [_.area] : [], // Ensure `areas` is set correctly
                    }));
                    if (_.country) getStates(_.country);
                    if (_.state) getCities(_.state);
                    setmodalOpen(true);
                  }}
                  view
                  edit
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {modalOpen && (
        <Modal heading={`${action} Vendor`} onClose={modalClose}>
          <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* Vendor Information */}
                <InputField
                  styleClass="col-span-1 md:col-span-1"
                  placeholder="Eg:Deepak"
                  label="Vendor name"
                  {...getFieldAttributes("name", {
                    required: "Vendor name is required",
                  })}
                />
                <SelectField
                  {...getFieldAttributes("type", {
                    required: "Vendor type is required",
                  })}
                  styleClass="col-span-1 md:col-span-1"
                  label="Vendor type"
                >
                  <option value="">Select type</option>
                  {VendorType.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.value}
                    </option>
                  ))}
                </SelectField>
                {VendorTypeWatch == "P" && (
                  <SelectField
                    {...getFieldAttributes("is_outsource", {
                      required: "This field is required",
                    })}
                    required
                    label="Is outsource"
                  >
                    <option value="">Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </SelectField>
                )}

                {/* Separation Line with Label */}
                {/* <div className="col-span-full my-7 flex items-center">
                  <hr className="flex-grow border-gray-400" />
                  <span className="px-4 text-gray-600">
                    Address and contact info
                  </span>
                  <hr className="flex-grow border-gray-400" />
                </div> */}
                 <div className='py-2 mt-4 mb-3 font-semibold text-center text-gray-700 bg-gray-100 rounded-lg col-span-full'>
                    Address and contact info
                 </div>
                {/* Address and Contact Information */}
                <InputField
                  styleClass="col-span-1 md:col-span-2"
                  placeholder="Enter address"
                  label="Address"
                  {...getFieldAttributes("address_1")}
                  required
                />
                <InputField
                  placeholder="Eg:1234567890"
                  label="Phone"
                  {...getFieldAttributes("phone")}
                  required
                />
                <InputField
                  placeholder="Eg:act@gmail.com"
                  label="Email"
                  {...getFieldAttributes("email")}
                  //   required
                />
                <InputField
                  placeholder="Eg:12644"
                  label="Registration no."
                  {...getFieldAttributes("reg_num")}
                />
                <InputField
                  placeholder="Eg:6ssf44"
                  label="GST no."
                  {...getFieldAttributes("gst_num")}
                />

                {/* Separation Line with Label */}
                <div className='py-2 mt-4 mb-3 font-semibold text-center text-gray-700 bg-gray-100 rounded-lg col-span-full'>
                 Point of contact info
                 </div>

                {/* Point of Contact Information */}
                <InputField
                  placeholder="Eg:deekshith"
                  label="Point of contact"
                  {...getFieldAttributes("poc_name", {
                    // required: "This field is required",
                  })}
                />
                <InputField
                  placeholder="Eg:987654323"
                  label="Point of contact phone"
                  {...getFieldAttributes("poc_phone", {
                    // required: "This field is required",
                  })}
                />
                {/* Separation Line with Label */}
                <div className='py-2 mt-4 mb-3 font-semibold text-center text-gray-700 bg-gray-100 rounded-lg col-span-full'>
                  Location info
                 </div>
                {/* Location Information */}
                <InputField
                  placeholder="Eg:576217"
                  label="Pincode"
                  name="pincode"
                  //   value={data.pincode?.toString()}
                  {...getFieldAttributes("pincode", {
                    required: "This field is required",
                    onChange: (
                      e: React.ChangeEvent<
                        | HTMLInputElement
                        | HTMLSelectElement
                        | HTMLTextAreaElement
                      >
                    ) => {
                      handleGetDataUsingPincodeOnchange(e);
                    },
                  })}
                />
                <SelectField
                  //   value={String(data.country || '')}
                  name="country"
                  label="Country"
                  {...getFieldAttributes("country", {
                    required: "This field is required",
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      reset((prev) => ({
                        ...prev,
                        country: e.target.value,
                        state: "",
                        city: "",
                      }));
                      getStates(e.currentTarget.value);
                    },
                  })}
                >
                  <option value="">Select Country</option>
                  {allCountries.map((_) => (
                    <option key={_.COUNTRY_CODE} value={_.COUNTRY_CODE}>
                      {_.COUNTRY_NAME}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  name="state"
                  label="State"
                  {...getFieldAttributes("state", {
                    required: "This field is required",
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      reset((prev) => ({
                        ...prev,
                        state: e.target.value,
                        city: "",
                      }));
                      getCities(e.currentTarget.value);
                    },
                  })}
                >
                  <option value="">Select State</option>
                  {allStates.map((_) => (
                    <option key={_.STATE_CODE} value={_.STATE_CODE}>
                      {_.STATE_NAME}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  {...getFieldAttributes("city", {
                    required: "This field is required",
                  })}
                  required
                  label="City"
                >
                  <option value="">Select City</option>
                  {allCities.map((_) => (
                    <option key={_.CITY_CODE} value={_.CITY_CODE}>
                      {_.CITY_NAME}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  label="Area"
                  {...getFieldAttributes("area", {
                    required: "This field is required",
                    onChange: (
                      e: React.ChangeEvent<
                        | HTMLInputElement
                        | HTMLSelectElement
                        | HTMLTextAreaElement
                      >
                    ) => {
                      reset((prev) => ({ ...prev, area: e.target.value }));
                    },
                  })}
                >
                  <option value="">Select Area</option>
                  {AreaWatch &&
                    AreaWatch.map((area: string, index: number) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                </SelectField>

                {/* Separation Line with Label */}
                {VendorTypeWatch == "P" && (
                  <>
                    <div className="col-span-full my-7 flex items-center">
                      <hr className="flex-grow border-gray-400" />
                      <span className="px-4 text-gray-600">Bank info</span>
                      <hr className="flex-grow border-gray-400" />
                    </div>

                    <SelectField
                      placeholder="Eg:Canara bank"
                      label="Bank name"
                      {...getFieldAttributes("bank_name", {
                        // required: "This field is required",
                      })}
                    >
                      <option value="">Select Bank</option>
                      {bankName.map((_) => (
                        <option key={_.BANK_CODE} value={_.BANK_CODE}>
                          {_.BANK_DESC}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      placeholder="Eg:saving bank"
                      label="Bank Ac/type."
                      {...getFieldAttributes("bank_acc_type", {
                        // required: "This field is required",
                      })}
                    >
                      <option value="">Select Account Type</option>
                      {bankAccType.map((_) => (
                        <option key={_.ACNT_TYPE} value={_.ACNT_TYPE}>
                          {_.ACNT_DESC}
                        </option>
                      ))}
                    </SelectField>
                    <InputField
                      //   required
                      placeholder="Eg:0603176683758"
                      label="Bank Ac/no."
                      {...getFieldAttributes("bank_acc_num", {
                        // required: "This field is required",
                      })}
                    />
                    <InputField
                      placeholder="Eg:santtekatte"
                      label="Bank branch name."
                      {...getFieldAttributes("bank_branch_name", {
                        // required: "This field is required",
                      })}
                    />
                  </>
                )}

                {action === "Edit" && (
                  <SelectField
                    {...getFieldAttributes("is_active")}
                    required
                    label="Is active"
                  >
                    <option value="">Select</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </SelectField>
                )}
              </div>
            </fieldset>
            <hr className="mt-4 border-gray-300 " />
            <div className="flex justify-end">
              <Button onClick={modalClose} varient="light" type="button">
                Cancel
              </Button>
              <Button varient="blue">Submit</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default Vendor;
