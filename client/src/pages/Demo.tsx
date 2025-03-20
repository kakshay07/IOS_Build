import { ChangeEvent, useCallback, useEffect, useState } from "react"
import InputField, {  Checkbox, SearchInput } from "../components/Input/Input"
import SelectField from "../components/Select/Select"
import useTable from "../components/Table/Table"
import Button, {ActionButtonGroup, AddButton, ExportExcell, FilterButton, FilterResetButton, UploadExcell} from "../components/Button/Button"
import Modal from "../components/Modal/Modal"
import Tooltip from "../components/Tooltip/Tooltip"
import { useFormField as useFieldAttributes } from "../hooks/form"
import ImportExportFile from "../components/ImportExportFile/ImportExportFile"
import Swal from "sweetalert2"
import { DeleteConfirmation } from "../utils/SweetAlert"
import { useForm } from "react-hook-form"
// import { validateEmail, validatePhoneNumber } from "../utils/validations"
// import { validateEmail, validatePhoneNumber } from "../utils/validations"

 class filterType {
  limit : number = 15;
}

class dataModel {
  name : string = '';
  age : number | '' = '';
  gender : string = '';
  phone : string = '';
  email : string = '';
  rollNo : number = 0;
  institution : number | ''= '';
  course : number | ''= '';
  courseYear : number | ''= '';
  joiningDate : string = '';
  terms : number = 0;
}

const dataAr = [
  {
  name : 'Ryal Rafter Amanna',
  age : 24,
  gender : 'M',
  phone : '8867342978',
  email : 'ryal@gmail.com',
  rollNo : 191703125,
  institution : 1,
  course : 2,
  courseYear : 2,
  joiningDate : '',
  terms : 1
  },
  {
    name : 'Deekshith',
    age : 24,
    gender : 'M',
    phone : '7788558978',
    email : 'dee@gmail.com',
    rollNo : 191703122,
    institution : 1,
    course : 1,
    courseYear : 1,
    joiningDate : '',
    terms : 1
    }

]

const Demo = () => {

  // react hook form 
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<dataModel>();
  const terms_watch = watch('terms'); 
  // hook to get fieldattributes of RHF
  const getFieldAttributes = useFieldAttributes({register,errors})

  const [dataArray, setdataArray] = useState<dataModel[]>(dataAr);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // const [uploadedFile, setuploadedFile] = useState<File>();
  const [importModalOpen, setimportModalOpen] = useState(false);
  const [importedFile, setimportedFile] = useState<File | undefined>()
  const [filter, setfilter] = useState<filterType>(new filterType());

  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)

  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table,page,setPage } = useTable(()=>{});

// =====================FOR FILTERS ====================//
// =====================================================//

const DefaultFilterValues = new filterType();
const {
  register: filterRegister,
  handleSubmit: handleFilterSubmit,
  reset: filterReset,
  getValues
} = useForm<filterType>({
  defaultValues: DefaultFilterValues || new filterType(), //provide default values for filter using defaultValues
});
const getFilterAttributes = useFieldAttributes({
  register: filterRegister,
  errors,
});

//for reseting ststaes
function resetFilterStates() {
  filterReset(new filterType());
  // getAllDataFunction()
}

const onFilterFormSubmit = (formData: filterType) => {
  setPage(0);
  // pass formdata to api
  console.log({ ...formData, page: Number(page) });
};

useEffect(() => {
  // CALL THE FUNCTION WHICH GETS DATA
}, [page]);
// =====================================================//
//=====================FILTER CODE END====================//
  

  //function to run afterform is validated
  const onFormSubmit = (formData : dataModel )=>{
    console.log(formData);
  };
  useEffect(() => {
    console.log(terms_watch);
    
    console.log('Terms updated' ,  terms_watch);
  }, [terms_watch]);


  //FOR ONEDIT -FETCHING DATA BASED ON ID AND SETTING DATA TO RESET FUNCTION
  // function HandleFetchCountryBasedOnCountryId(CountryID:number){
  //   requestHandler(
  //       async () => {
  //         return await CountryApis.FetchCountryBasedOnCountryId(CountryID);
  //       },
  //       (data) => {
  //           const country = JSON.parse(data.returnResult); 
  //           reset(country);
  //       },
  //       (errorMessage) => {
  //         toastError.fire({
  //           title: errorMessage,
  //         });
  //       }
  //     );
  // }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  // function modalClose(){
  //   setmodalOpen(false);
  // }
    const modalClose = useCallback(() => {
     setmodalOpen(false);
  }, []);

  useEffect(() => {
    if(!modalOpen){
      reset(new dataModel());
    }
  }, [modalOpen]);

  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">

        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0">Demo Page</h2></div>
          <div className="flex justify-start lg:justify-end flex-wrap" >
            <SearchInput name="" onChange={()=>{}} onSearch={()=>{}} placeholder="Search user by name" />
            <UploadExcell onClick={()=>{
              setimportedFile(undefined)
              setimportModalOpen(true)
              }}></UploadExcell>
            <ExportExcell
              onClick={()=>{}}
            ></ExportExcell>
            <AddButton onClick={()=>{setaction('Add');setmodalOpen(true)}}>Add users</AddButton>
          </div>
        </div>

        <hr className="my-3 border-gray-300 " />

        {/* ===== filter ===== */}
        <div >
          {/* <h2 className="text-lg font-normal">Filter</h2> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select Country</option>
            </SelectField>
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select State</option>
            </SelectField>
            <SelectField name="" onChange={()=>{}}>
              <option value="">Select Gender</option>
            </SelectField>
            <InputField required value={filter.limit.toString()}   onChange={(e)=>{setfilter(prev => ({...prev , limit : Number(e.target.value)}))}} name="limit" type="number" placeholder="Limit" />
            <div className="flex">
              <FilterButton onClick={()=>{}}></FilterButton>
              <FilterResetButton onClick={()=>{}}></FilterResetButton>
            </div>
          </div>
        </div>
         <form
          noValidate
          onSubmit={
            handleFilterSubmit(onFilterFormSubmit)
          }
        >
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
                {/*  <InputField
              {...getFilterAttributes('user_name',{
                onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                  filterReset((prev) => ({ ...prev, user_name: e.target.value }));
                }
              })}
              label="Search by user name"
            />
            <SelectField
              label="Roles"
              {...getFilterAttributes('role_id',{
                onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                  filterReset((prev) => ({
                    ...prev,
                    role_id: Number(e.target.value),
                  }))
                }
              })}
            >
              <option value="">Select role</option>
              {roles.filter(r =>r.is_active==1).map((_, index) => (
                <option key={index} value={_.role_id?.toString()}>
                  {" "}
                  {_.role_name}
                </option>
              ))}{" "}
            </SelectField>*/}
            <InputField
                {...getFilterAttributes('limit',{
                  onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                    filterReset((prev) => ({
                      ...prev,
                      limit: Number(e.target.value),
                    }))
                  }
                })}
            />
            <div className="flex ">
              <FilterResetButton
                type="button"
                onClick={() => {
                  resetFilterStates();
                }}
              ></FilterResetButton>
              <FilterButton onClick={() => {}}></FilterButton>
            </div>
          </div>
        </form> 

      </div>  

      {/* ===== Table ===== */}
      <Table>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Course</th>
            <th>Institution</th>
            <th>Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {
            dataArray.map((_ , index)=>{
              const {limit} =getValues()
              return (
                <tr key={index}>
                  <td>{page*limit+(index + 1)}</td>
                  <td>
                    <Tooltip text={`${_.email}`}>
                    {_.name}  
                    </Tooltip>
                  </td>
                  <td>{_.phone}</td>
                  <td>{_.course}</td>
                  <td>{_.institution.toString()}</td>
                  <td>{_.courseYear.toString()}</td>
                  <td width={'15%'}>
                    <ActionButtonGroup
                      onView={()=>{
                          setaction('View');
                          // setdata(dataArray.filter(a => (a.rollNo == _.rollNo))[0]);
                          reset(_)
                          setmodalOpen(true);
                        }
                      }
                      onEdit={()=>{
                          setaction('Edit');
                          reset(_)
                          setmodalOpen(true);
                        }
                      }
                      onDelete={()=>{
                        DeleteConfirmation.fire().then((result) => {
                          if (result.isConfirmed) {
                            setdataArray(dataArray.filter(a => (a.rollNo != _.rollNo)));
                            Swal.fire({
                              title: "Deleted!",
                              text: "Your file has been deleted.",
                              icon: "success"
                            });
                          }
                        });
                      }}
                      view
                      edit
                      deletee
                    />
                  </td>
                </tr>
              )
            })
          }
        </tbody>          
      </Table>


      {/* Modal for Add , Edit and View */}
      {modalOpen && 
      <Modal heading={`${action} User`} onClose={modalClose}>
        <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              <InputField 
                {...getFieldAttributes('name',{ required: "Username is required" })}
                label="Name" 
                placeholder="John Doe"  
              />
              <InputField
                // if we dont use useFieldAttributes 
                register={register("age", { required: "Age is required" , min : {
                  value : 1,
                  message : "Age must be greater than zero"
                } })}
                error={!!errors.age}
                errorMessage={errors.age?.message}
                type="number" 
                label="Age" 
                placeholder="In Years" 
                required 
              />
              <SelectField 
                {...getFieldAttributes(
                  'gender',
                  { 
                    required: "Gender is required",
                    validate: (value : string) => value === "F" || "Gender must be Female" 
                  })
                }
                label="Gender"  
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </SelectField>
              <InputField 
                {...getFieldAttributes('phone' , {
                  required: "Phone number is required",
                  // validate: validatePhoneNumber
                })}
                label="Phone" 
                placeholder="Eg: 9876543210" 
                type="tel" 
              />
              <InputField 
                {...getFieldAttributes('email' , {
                  required: "Email is required",
                  // validate : validateEmail
                })}
                label="Email"  
                placeholder="johnDoe@gmail.com" 
              />
              <InputField 
                {...getFieldAttributes('rollNo' , {
                  required : true,
                  onChange: (e : ChangeEvent<HTMLInputElement>) => {
                    console.log(`changed:`, e.target.value);
                  }
                })}
                label="Roll Number"   
              />
              <SelectField 
                {...getFieldAttributes('institution',{required : true})}
                label="Institute" 
              >
                <option value="">Select Institute</option>
                <option value="1">Tapmi</option>
                <option value="2">MIT</option>
              </SelectField>
              <SelectField 
                {...getFieldAttributes('course')}
                label="course" 
              >
                <option value="">Select course</option>
                <option value="1">MBA</option>
                <option value="2">B.Tech</option>
              </SelectField>
              <SelectField 
                {...getFieldAttributes('courseYear')} 
                label="Course Year" 
              >
                <option value="">Select Course Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </SelectField>
              {/* <div className="flex">
                <Checkbox />
                <Checkbox/>
              </div> */}
              {/* <DragAndDropFileInput required file={uploadedFile} onFileUpload={(data : File)=>{setuploadedFile(data)}}/> */}
              <Checkbox 
                label="Agree Terms"
                {...getFieldAttributes('terms' , {
                  required : 'Please agree to terms'
                  })
                }
              />
              {
                terms_watch ? 'terms agreed' : ''
              }
            </div> 
          </fieldset>
          <hr className="mt-4 border-gray-300 " />
          <div className="flex justify-end">
            <Button onClick={modalClose} varient="light" type="button">Cancel</Button>
            <Button varient="blue">Submit</Button>
          </div>
        </form>
      </Modal>}
      <ImportExportFile file={importedFile} onFileUpload={(data)=>{setimportedFile(data)}}  modalOpen={importModalOpen} onClose={()=>{setimportModalOpen(false)}} />
    </div>
  )
}

export default Demo



// =============================== OLD BASE CODE OF CMM WITH NO REACT HOOK FORM==========================//

// import { useEffect, useState } from "react"
// import InputField, {  DragAndDropFileInput, SearchInput } from "../components/Input/Input"
// import SelectField from "../components/Select/Select"
// import useTable from "../components/Table/Table"
// import Button, {ActionButtonGroup, AddButton, ExportExcell, FilterButton, FilterResetButton, UploadExcell} from "../components/Button/Button"
// import Modal from "../components/Modal/Modal"
// import Tooltip from "../components/Tooltip/Tooltip"
// import { useOnInputState, useOnSubmit, useValue } from "../hooks/form"
// import ImportExportFile from "../components/ImportExportFile/ImportExportFile"
// import Swal from "sweetalert2"
// import { DeleteConfirmation } from "../utils/SweetAlert"
// import { checkServerIndex, requestHandler } from "../utils/api"
// import { useAuth } from "../contexts/AuthContext"

//  class filterType {
//   limit : number = 15;
// }

// class dataModel {
//   name : string = '';
//   age : number = 0;
//   gender : string = '';
//   phone : string = '';
//   email : string = '';
//   rollNo : number = 0;
//   institution : number = 0;
//   course : number = 0;
//   courseYear : number = 0;
//   joiningDate : string = '';
// }

// const dataAr = [
//   {
//   name : 'Ryal Rafter Amanna',
//   age : 23,
//   gender : 'M',
//   phone : '8867342978',
//   email : 'ryal@gmail.com',
//   rollNo : 191703125,
//   institution : 1,
//   course : 2,
//   courseYear : 2,
//   joiningDate : ''
//   },
//   {
//     name : 'Deekshith',
//     age : 24,
//     gender : 'M',
//     phone : '7788558978',
//     email : 'dee@gmail.com',
//     rollNo : 191703122,
//     institution : 1,
//     course : 1,
//     courseYear : 1,
//     joiningDate : ''
//     },

// ]

// const Demo = () => {
//   const [data, setdata] = useState<dataModel>(new dataModel());
//   const [dataArray, setdataArray] = useState<dataModel[]>(dataAr);
//   const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
//   const [uploadedFile, setuploadedFile] = useState<File>();
//   const [importModalOpen, setimportModalOpen] = useState(false);
//   const [importedFile, setimportedFile] = useState<File | undefined>()
//   const [filter, setfilter] = useState<filterType>(new filterType());

//   // state used to handle modal open state
//   const [modalOpen, setmodalOpen] = useState(false)

//   // Custom Hook - gives a "table" component and current page number and a function to change the current page
//   const {Table , page} = useTable(()=>{});
//   console.log(page);
  
//   // custom Hook - sets the value of the state on input change
//   const onInput = useOnInputState(data , setdata)

//   // custom Hook - this is used to set attributes of input and select elements
//   // this will set name , value and onChange
//   const FieldAttributes = useValue(data , onInput)

//   // custom Hook - handles form submission
//   // we need to pass a callback function to "useOnSubmit" , 
//   // that callback function will be called after validation of the form
//   const onFormSubmit = useOnSubmit(()=>{
//     console.log(data);
//   });

//   // function to empty the "data" state 
//   function resetDatastate(){
//     setdata(new dataModel());
//   }

//   // function to pass to the modal close button
//   // this closes the modal and clears the "data" state
//   function modalClose(){
//     setmodalOpen(false);
//     resetDatastate()
//   }

//   useEffect(() => {
//     console.log(data);
//   }, [data])


//   const {user} = useAuth()
//   useEffect(() => {
//       requestHandler(
//           async () => {
//               return await checkServerIndex();
//           },
//           (data) => {
//               console.log(data.data  , 'demo data');
//           },
//           alert
//       );

//       console.log(user , 'user');
      
//   }, );
  
  
//   return (
//     <div>
// {/*=====usable ====== */}

//             {/* <div className='mt-10'>
//               <div className="sm:hidden">
//                 <label htmlFor="Tab" className="sr-only">Tab</label>

//                 <select id="Tab" className="w-full rounded-md border-gray-200">
//                   <option>Settings</option>
//                   <option>Messages</option>
//                   <option>Archive</option>
//                   <option >Notifications</option>
//                 </select>
//               </div>

//               <div className="hidden sm:block">
//                 <div className="border-b border-gray-200">
//                   <nav className="-mb-px flex gap-6" aria-label="Tabs">
//                     <a
//                       href="#"
//                       className="inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>

//                       Settings
//                     </a>

//                     <a
//                       href="#"
//                       className="inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
//                         />
//                       </svg>

//                       Messages
//                     </a>

//                     <a
//                       href="#"
//                       className="inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
//                         />
//                       </svg>

//                       Archive
//                     </a>

//                     <a
//                       href="#"
//                       className="inline-flex shrink-0 items-center gap-2 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600"
//                       aria-current="page"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
//                         />
//                       </svg>

//                       Notifications
//                     </a>
//                   </nav>
//                 </div>
//               </div>
//             </div> */}







//       {/* template header */}
//       <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">

//         {/* ===== Head ===== */}
//         <div className="flex items-center justify-between flex-wrap">
//           <div><h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0">Demo Page</h2></div>
//           <div className="flex justify-start lg:justify-end flex-wrap" >
//             <SearchInput name="" onChange={()=>{}} onSearch={()=>{}} placeholder="Search user by name" />
//             <UploadExcell onClick={()=>{
//               setimportedFile(undefined)
//               setimportModalOpen(true)
//               }}></UploadExcell>
//             <ExportExcell
//               urlPath="/file/download"
//               filename="demo_csv_export"
//             ></ExportExcell>
//             <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add users</AddButton>
//           </div>
//         </div>

//         <hr className="my-3 border-gray-300 " />

//         {/* ===== filter ===== */}
//         <div >
//           {/* <h2 className="text-lg font-normal">Filter</h2> */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
//             <SelectField name="" onChange={()=>{}}>
//               <option value="">Select Country</option>
//             </SelectField>
//             <SelectField name="" onChange={()=>{}}>
//               <option value="">Select State</option>
//             </SelectField>
//             <SelectField name="" onChange={()=>{}}>
//               <option value="">Select Gender</option>
//             </SelectField>
//             <InputField required value={filter.limit.toString()}   onChange={(e)=>{setfilter(prev => ({...prev , limit : Number(e.target.value)}))}} name="limit" type="number" placeholder="Limit" />
//             <div className="flex">
//               <FilterButton onClick={()=>{}}></FilterButton>
//               <FilterResetButton onClick={()=>{}}></FilterResetButton>
//             </div>
//           </div>
//         </div>

//       </div>  

//       {/* ===== Table ===== */}
//       <Table>
//         <thead>
//           <th>Sl</th>
//           <th>Name</th>
//           <th>Roll No.</th>
//           <th>Course</th>
//           <th>Institution</th>
//           <th>Year</th>
//           <th>Action</th>
//         </thead>
//         <tbody>

//           {
//             dataArray.map((_ , index)=>{
//               return (
//                 <tr>
//                   <td>{index + 1}</td>
//                   <td>
//                     <Tooltip text={`${_.email}`}>
//                     {_.name}  
//                     </Tooltip>
//                   </td>
//                   <td>{_.phone}</td>
//                   <td>{_.course}</td>
//                   <td>{_.institution.toString()}</td>
//                   <td>{_.courseYear.toString()}</td>
//                   <td width={'15%'}>
//                     <ActionButtonGroup
//                       onView={()=>{
//                           setaction('View');
//                           setdata(dataArray.filter(a => (a.rollNo == _.rollNo))[0]);
//                           setmodalOpen(true);
//                         }
//                       }
//                       onEdit={()=>{
//                           setaction('Edit');
//                           setdata(dataArray.filter(a => (a.rollNo == _.rollNo))[0]);
//                           setmodalOpen(true);
//                         }
//                       }
//                       onDelete={()=>{
//                         DeleteConfirmation.fire().then((result) => {
//                           if (result.isConfirmed) {
//                             setdataArray(dataArray.filter(a => (a.rollNo != _.rollNo)));
//                             Swal.fire({
//                               title: "Deleted!",
//                               text: "Your file has been deleted.",
//                               icon: "success"
//                             });
//                           }
//                         });
//                       }}
//                       view
//                       edit
//                       deletee
//                     />
//                   </td>
//                 </tr>
//               )
//             })
//           }
//         </tbody>          
//       </Table>


//       {/* Modal for Add , Edit and View */}
//       {modalOpen && 
//       <Modal heading={`${action} User`} onClose={modalClose}>
//         <form noValidate onSubmit={onFormSubmit}>
//           <fieldset disabled={action === 'View'}>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
//               <InputField required label="Name" placeholder="John Doe" {...FieldAttributes('name')} />
//               <InputField required label="Age" placeholder="In Years" type="number" {...FieldAttributes('age')} />
//               <SelectField required label="Gender" {...FieldAttributes('gender')} >
//                 <option value="">Select gender</option>
//                 <option value="M">Male</option>
//                 <option value="F">Female</option>
//               </SelectField>
//               <InputField required label="Phone" placeholder="Eg: 9876543210" type="number" {...FieldAttributes('phone')} />
//               <InputField required label="Email"  placeholder="johnDoe@gmail.com" type="email"  {...FieldAttributes('email')} />
//               <InputField required label="Roll Number"   {...FieldAttributes('rollNo')} />
//               <SelectField required label="Institute" {...FieldAttributes('institution')} >
//                 <option value="">Select Institute</option>
//                 <option value="1">Tapmi</option>
//                 <option value="2">MIT</option>
//               </SelectField>
//               <SelectField required label="course" {...FieldAttributes('course')} >
//                 <option value="">Select course</option>
//                 <option value="1">MBA</option>
//                 <option value="2">B.Tech</option>
//               </SelectField>
//               <SelectField required label="Course Year" {...FieldAttributes('courseYear')} >
//                 <option value="">Select Course Year</option>
//                 <option value="1">1</option>
//                 <option value="2">2</option>
//                 <option value="3">3</option>
//               </SelectField>
//               {/* <div className="flex">
//                 <Checkbox />
//                 <Checkbox/>
//               </div> */}
//               <DragAndDropFileInput required file={uploadedFile} onFileUpload={(data : File)=>{setuploadedFile(data)}}/>
//             </div> 
//           </fieldset>
//           <hr className="mt-4 border-gray-300 " />
//           <div className="flex justify-end">
//             <Button onClick={modalClose} varient="light" type="button">Cancel</Button>
//             <Button varient="blue">Submit</Button>
//           </div>
//         </form>
//       </Modal>}
//       <ImportExportFile file={importedFile} onFileUpload={(data)=>{setimportedFile(data)}}  modalOpen={importModalOpen} onClose={()=>{setimportModalOpen(false)}} />
//     </div>
//   )
// }

// export default Demo