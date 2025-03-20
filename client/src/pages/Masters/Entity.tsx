import { ChangeEvent, useEffect, useState } from "react"
import InputField, { DragAndDropFileInput } from "../../components/Input/Input"
import useTable from "../../components/Table/Table"
import Button, {ActionButtonGroup, AddButton} from "../../components/Button/Button"
import Modal from "../../components/Modal/Modal"
import { useFormField as useFieldAttributes } from "../../hooks/form"
import {  toastError, toastSuccess } from "../../utils/SweetAlert"
import { AddEntity, GetAllAdditionalFeature, GetDataUsingPincode, GetEntity, UpdateEntity, getAdditionalAccessOfEntity, giveAdditionalFeaturesAccessToEntity, requestHandler } from "../../utils/api"
import SelectField from "../../components/Select/Select"
import { useMaster } from "../../contexts/MasterContext"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext"
import { additionaFeatureModel } from "./AdditionalFeature"

class extras {
  areas?: string[]=[];
  entityImage?:string ;
}
export class entityModel extends extras {
  entity_id : string | null = null;
  name : string | null = null;
  short_desc : string | null = null;
  address : string | null = null;
  reg_num : string | null = null;
  estab_date : Date | null = null;
  expiry_date : Date | null = null;
  email : string | null = null;
  bank_ac_num : number | null = null;
  bank_ifsc : string | null = null;
  bank_name : string | null = null;
  bank_location : string | null = null;
  gst_no: string | null = null;
  country: string | null = null;
  state: string | null = null;
  city?: string | null = null;
  area?:string | null = null;
  pincode?: string | null = null;
  additional_info?: string = "0";
  phone_num?:string | null =null;

  //======S3 RELATED THINGS======//
  s3_region:string | null = null;
  s3_access_key_id:string | null = null;
  s3_secret_access_key :string | null = null;
  s3_bucket_name:string | null = null;
  s3_cloudfront_url:string | null = null;
  imageFile:File | null = null;

  //======GMAIL RELATED VALUES======//
  gmail_id:string | null = null;
  app_password:string | null = null;
}


const Entity = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<entityModel>();
  const country_watch = watch('country'); 
  const state_watch = watch('state'); 
  const area_watch=watch('area');
  const areas_watch =watch('areas');
  const imageWatch=watch('imageFile');
  const entityWatch =watch('entity_id');

  const [imageurl,setimageUrl]=useState('')
  const getFieldAttributes = useFieldAttributes({register,errors})

  const [dataArray, setdataArray] = useState<entityModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  const [modalOpen, setmodalOpen] = useState(false)
  const {allCountries ,getStates , allStates, getCities , allCities} = useMaster();
  const {user}=useAuth();

  const [allAdditionalFeatures, setAllAdditionalFeatures] = useState<additionaFeatureModel[]>([]);
  const [additionalFeatures, setAdditionalFeatures] = useState<additionaFeatureModel[]>([]);
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false);
  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table } = useTable(()=>{});

  // function to get all entity 
  function getAllEntity(){
    return requestHandler(
      async () => {
          return await GetEntity();
      },
      (data) => {
        setdataArray(data.data)
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

  // custom Hook - handles form submission
  // we need to pass a callback function to "useOnSubmit" , 
  // that callback function will be called after validation of the form
  const onFormSubmit = (formData : entityModel )=>{
    if(action == 'Add'){
      requestHandler(
        async ()=>{ return await AddEntity(formData)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllEntity();
            setmodalOpen(false)
          } else {
            toastError.fire({
              title : data.message 
            })
          }
          
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
      )
    } else if(action == 'Edit') { 
      requestHandler(
        ()=>{return UpdateEntity(formData)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllEntity();
          setmodalOpen(false)
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
      )
    }
  }

  function getAllAdditionalFeature(){
    requestHandler(
      async () => {
          return await GetAllAdditionalFeature();
      },
      (data) => {
        setAllAdditionalFeatures(data.data.filter((_:additionaFeatureModel)=> _.is_active == 1))
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

  async function handleGiveAdditionalAccessToEntity(data : {
    entity_id : number,
    successCallBack : () => void
  }){
    await requestHandler(
      async () => {
          return await giveAdditionalFeaturesAccessToEntity({
            entity_id : data.entity_id,
            features : additionalFeatures
          });
      },
      (data1) => {
        data.successCallBack()
        toastSuccess.fire({
          title : data1.message
        })
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

  async function handleGetAdditionalAccessOfEntity(data : {
    entity_id : number,
  }){
    await requestHandler(
      async () => {
          return await getAdditionalAccessOfEntity({
            entity_id : data.entity_id,
          });
      },
      (data1) => {
        setAdditionalFeatures(data1.data)
      },
      (errorMessage)=>{
        toastError.fire({
          title : errorMessage
        })
      }
  );
  }

  function FeatureModalClose(){
    setFeaturesModalOpen(false); 
    setAdditionalFeatures([]);
    reset(new entityModel());
  }

  const handleCheckFeature = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    const featureName = e.target.name;
     if(!value) {
      setAdditionalFeatures(prev => prev.filter(_ => _.feature_name != featureName))
    } else {
      const feature_to_add = allAdditionalFeatures.find(_ => _.feature_name == featureName);
      if(feature_to_add){
        setAdditionalFeatures(prev => [...prev.filter(_ => _.feature_name != featureName) , feature_to_add])
      }
    }
    
  }

  const handleGetCheckboxValue = (featureName : string) => {
    const foundObj = additionalFeatures.find(_ => _.feature_name === featureName)    
    return  foundObj ? true : false;
  }

  const handleSubmitAdditionalAccess = async () => {
    const entity_id =entityWatch;
    if(entity_id){
      await handleGiveAdditionalAccessToEntity({
        entity_id : Number(entity_id),
        successCallBack : () => {
          FeatureModalClose();
        } 
      });
    }
  }

  // function to empty the "data" state 
  function resetDatastate(){
    reset(new entityModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate();
    setimageUrl('');
  }
  // const modalClose = useCallback(() => {
  //    setmodalOpen(false);
  //   resetDatastate();
  //   setimageUrl('');
  // }, []);

  function handleGetDataUsingPincodeOnchange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
    const pincode = (e.target.value);
    reset((prevData) => ({
      ...prevData,
      pincode : String(pincode),
    }));
    // Call API only when pincode length is 6
    if (pincode.length == 6) {
        requestHandler(
            async () => {
                return await GetDataUsingPincode(Number(pincode));
            },
            (data) => {
              if(data.data == '')  reset((prev)=>({...prev ,city:'',state:'',area:''}))
              const { city_code, state_code,country_code } = data.data[0];
              const areas = data.data.map((item:any) => item.area);
              reset((prev)=>({...prev ,city:city_code,state:state_code,country:country_code,area:areas[0],areas:areas}))
              getStates(country_code)
              getCities(state_code)
            },
            (errorMessage)=>{
              toastError.fire({
                title : errorMessage
              })
            }
        );
  }
}

  useEffect(() => {
    getAllEntity()
    getAllAdditionalFeature()
  }, []);


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
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0">
              Entity Master
            </h2>
          </div>
          <div className="flex justify-start lg:justify-end flex-wrap">
            <AddButton
              onClick={() => {
                setaction("Add");
                resetDatastate();
                setmodalOpen(true);
              }}
            >
              Add Entity
            </AddButton>
          </div>
        </div>
        {/* <hr className ="my-3 border-gray-300 " /> */}
        {/* ===== filter ===== */}
      </div>

      {/* ===== Table ===== */}
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            {/* <th>Entity id</th> */}
            <th>Entity name</th>
            <th>Register number</th>
            <th>Address</th>
            <th>Phone number</th>
            <th>Email</th>
            <th>Entity image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                {/* <td>{_.entity_id}</td> */}
                <td title={_.entity_id?.toString()}>
                   <b> {_.name}</b>
                </td>
                <td>{_.reg_num}</td>
                <td>{_.address}</td>
                <td>{_.phone_num}</td>
                <td>{_.email}</td>
                <td>     <img
                    src={
                      !_.entityImage
                        ? ''
                        : `${_?.s3_cloudfront_url}/${_?.entityImage}`
                    }
                    className="object-cover w-10 h-10 rounded-full border border-yellow-600"
                    alt="Preview"
                  /></td>
                <td width={"15%"}>
                <span className=" inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                  <ActionButtonGroup
                    onView={() => {
                      setaction("View");
                      reset((prevData) => ({
                        ...prevData,
                        ..._,
                        areas: _.area ? [_.area] : [], // Ensure `areas` is set correctly
                      }));
                      setmodalOpen(true);
                    }}
                    onEdit={() => {
                      setaction("Edit");
                      reset((prevData) => ({
                        ...prevData,
                        ..._,
                        imageFile:_.entityImage as unknown as File,
                        areas: _.area ? [_.area] : [], // Ensure `areas` is set correctly
                      }));
                      setmodalOpen(true);
                    }}
                    view
                    edit
                  />
                   <button className="px-3 inline" onClick={async ()=>{
                      setAdditionalFeatures([]);
                      reset((prevData) => ({
                        ...prevData,
                        ..._,
                        areas: _.area ? [_.area] : [],
                      }));
                      await handleGetAdditionalAccessOfEntity({entity_id : Number(_.entity_id)})
                      setFeaturesModalOpen(true);
                    }}
                    title='Additional Features'
                    >
                      <i className="fa-regular fa-square-plus text-gray-600"></i>
                    </button>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Add , Edit and View */}
      {modalOpen && (
        <Modal heading={`${action} Entity`} onClose={modalClose}>
          <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField
                  label="Name"
                  placeholder="GDPL"
                  {...getFieldAttributes("name", {
                    required: "Entity name is required",
                  })}
                />
                <InputField
                  styleClass="col-span-1 md:col-span-3 "
                  label="Address"
                  {...getFieldAttributes("address", {
                    required: "Address is required",
                  })}
                />
                <InputField
                  label="Short Description"
                  {...getFieldAttributes("short_desc")}
                />
                <InputField
                  label="Email"
                  type="email"
                  {...getFieldAttributes("email")}
                />
                 <InputField
                  label="Phone number"
                  {...getFieldAttributes("phone_num")}
                />
                <InputField
                  label="Register number"
                  {...getFieldAttributes("reg_num")}
                />
                <InputField
                  label="Established date"
                  type="date"
                  {...getFieldAttributes("estab_date", {
                    required: "Establish date is required",
                  })}
                />
                <InputField
                  label="Expiry date"
                  type="date"
                  {...getFieldAttributes("expiry_date", {
                    required: "Expiry date is required",
                  })}
                />
                <InputField
                  label="Bank account number"
                  {...getFieldAttributes("bank_ac_num")}
                />
                <InputField
                  label="Bank IFSC"
                  {...getFieldAttributes("bank_ifsc")}
                />
                <InputField
                  label="Bank name"
                  {...getFieldAttributes("bank_name")}
                />
                <InputField
                  label=" Bank location"
                  {...getFieldAttributes("bank_location")}
                />
                <InputField
                  label="GST number"
                  {...getFieldAttributes("gst_no")}
                />

                <div className="col-span-full my-7 flex items-center">
                  <hr className="flex-grow border-gray-400" />
                  <span className="px-4 text-gray-600">Location info</span>
                  <hr className="flex-grow border-gray-400" />
                </div>

                {/* Location Information */}
                <InputField
                  {...getFieldAttributes("pincode", {
                    required: "Pincode is required",
                    onChange: (e:ChangeEvent<HTMLInputElement>) => {
                      handleGetDataUsingPincodeOnchange(e)
                    },
                  })}
                  placeholder="Eg:576217"
                  label="Pincode"
                />

                <SelectField
                  label="Country"
                  {...getFieldAttributes("country", {
                    required: 'Country is required',
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
                  <option value="">Select country</option>
                  {allCountries.map((_) => (
                    <option key={_.COUNTRY_CODE} value={_.COUNTRY_CODE}>
                      {_.COUNTRY_NAME}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="State"
                  {...getFieldAttributes("state", {
                    required:'State is required',
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
                  <option value="">Select state</option>
                  {allStates.map((_) => (
                    <option key={_.STATE_CODE} value={_.STATE_CODE}>
                      {_.STATE_NAME}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="City"
                  {...getFieldAttributes("city", {
                    required: 'City is required',
                  })}
                >
                  <option value="">Select city</option>
                  {allCities.map((_) => (
                    <option key={_.CITY_CODE} value={_.CITY_CODE}>
                      {_.CITY_NAME}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="Area"
                  {...getFieldAttributes('area',{
                    required:'Area is required',
                    onchange :(e: ChangeEvent<HTMLInputElement>)=>{
                      reset((prev) => ({ ...prev, area: e.target.value }))
                    }
                  })}
                >
                  <option value="">Select Area</option>
                  {area_watch &&
                    areas_watch?.map((area: string, index: number) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                </SelectField>

                <SelectField
                  {...getFieldAttributes("additional_info")}
                  label="Additional Information"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </SelectField>

                <div className="col-span-full my-7 flex items-center">
                  <hr className="flex-grow border-gray-400" />
                  <span className="px-4 text-gray-600">S3 info</span>
                  <hr className="flex-grow border-gray-400" />
                </div>
                <InputField
                  label="S3 region"
                  {...getFieldAttributes("s3_region")}
                />
                <InputField
                  label="S3 access key id "
                  {...getFieldAttributes("s3_access_key_id")}
                />
                <InputField
                  label="S3 secret access key"
                  {...getFieldAttributes("s3_secret_access_key")}
                />
                <InputField
                  label="S3 bucket name"
                  {...getFieldAttributes("s3_bucket_name")}
                />
                <InputField
                  label="S3 cloud front url"
                  {...getFieldAttributes("s3_cloudfront_url")}
                />
                {action=='Edit' &&
                <DragAndDropFileInput   file={ imageWatch } 
                // desc=`${}`"Upload user profile image "
                // desc={`${action=='Add' ? 'Upload user profile image':'Edit profile image'}`}
                accept={[".png", ".jpg", ".jpeg"]}
                fileTypeLable="image"
                onFileUpload={(data : File)=>{
                  const imageUrl = URL.createObjectURL(data)
                  setimageUrl(imageUrl);
                  reset((prev) => ({
                      ...prev,
                      imageFile: data,
                    }));}
                }
              />
                }
                { action === 'Edit' && (
                <div className="flex">
                    <div className="w-16 h-16 border mt-3 ml-10 border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                        <img 
                            src={ imageurl ? imageurl :`${user?.s3_cloudfront_url}/${imageWatch}`} 
                            width={65} 
                            height={50} 
                            className="object-cover w-full h-full" 
                            alt="Preview"
                        />
                    </div>
                </div>
            )}

                <div className="col-span-full my-7 flex items-center">
                  <hr className="flex-grow border-gray-400" />
                  <span className="px-4 text-gray-600">Gmail Info</span>
                  <hr className="flex-grow border-gray-400" />
                </div>

                <InputField
                  label="Gmail Id"
                  {...getFieldAttributes("gmail_id")}
                />
                <InputField
                  label="Google App Password"
                  {...getFieldAttributes("app_password")}
                />
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

{
        featuresModalOpen && 
        <Modal onClose={FeatureModalClose} heading ='Additional Features Access'>
          <div>
            <div className="grid grid-cols-3 gap-5">
              {
                allAdditionalFeatures.filter(_=>_.feature_type == 'E').length ?
                <div className="border p-3 rounded-xl">
                  <div className="text-center bg-gray-200 py-2 rounded-md text-xl">
                    <i className="fa-regular fa-envelope mr-2"></i> Email
                  </div>
                  {
                    allAdditionalFeatures.filter(_=>_.feature_type == 'E').map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-4 border-b-2 w-full">
                        <span className="ml-2">{feature.feature_name}</span>
                        <input onChange={handleCheckFeature} name={feature.feature_name} checked={handleGetCheckboxValue(feature.feature_name)} type="checkbox" className="mr-2" />
                      </div>
                    ))
                  }
                </div> : ''
              }
              {
                allAdditionalFeatures.filter(_=>_.feature_type == 'W').length ?
                  <div className="border p-3 rounded-xl">
                    <div className="text-center bg-gray-200 py-2 rounded-md text-xl">
                      <i className="fa-brands fa-whatsapp mr-2"></i> Whatsapp
                    </div>
                    {
                      allAdditionalFeatures.filter(_=>_.feature_type == 'W').map((feature, index) => (
                        <div key={index} className="flex justify-between items-center py-4 border-b-2 w-full">
                          <span className="ml-2">{feature.feature_name}</span>
                          <input onChange={handleCheckFeature} name={feature.feature_name} checked={handleGetCheckboxValue(feature.feature_name)} type="checkbox" className="mr-2" />
                        </div>
                      ))
                    }
                  </div> : ''
              }
              {
                allAdditionalFeatures.filter(_=>_.feature_type == 'S').length ?
                <div className="border p-3 rounded-xl">
                  <div className="text-center bg-gray-200 py-2 rounded-md text-xl">
                    <i className="fa-regular fa-comment-dots mr-2"></i> SMS
                  </div>
                  {
                    allAdditionalFeatures.filter(_=>_.feature_type == 'S').map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-4 border-b-2 w-full">
                        <span className="ml-2">{feature.feature_name}</span>
                        <input onChange={handleCheckFeature} name={feature.feature_name} checked={handleGetCheckboxValue(feature.feature_name)} type="checkbox" className="mr-2" />
                      </div>
                    ))
                  }
                </div>  : ''
              }
              {
                allAdditionalFeatures.filter(_=> !["E","W","S"].includes(_.feature_type)).length ?
                <div className="border p-3 rounded-xl">
                  <div className="text-center bg-gray-200 py-2 rounded-md text-xl">
                  <i className="fa-solid fa-circle-plus mr-2"></i> Other
                  </div>
                  {
                    allAdditionalFeatures.filter(_=> !["E","W","S"].includes(_.feature_type)).map((feature, index) => (
                      <div key={index} className="flex justify-between items-center py-4 border-b-2 w-full">
                        <span className="ml-2">{feature.feature_name}</span>
                        <input onChange={handleCheckFeature} name={feature.feature_name} checked={handleGetCheckboxValue(feature.feature_name)} type="checkbox" className="mr-2" />
                      </div>
                    ))
                  }
                </div>  : ''
              }
            </div>
          </div>
          <hr className="mt-4 border-gray-300 " />
            <div className="flex justify-end">
              <Button onClick={FeatureModalClose} varient="light" type="button">
                Cancel
              </Button>
              <Button varient="blue" onClick={handleSubmitAdditionalAccess}>Submit</Button>
            </div>
        </Modal>
      }
    </div>
  );
}

export default Entity