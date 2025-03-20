import { ChangeEvent, useEffect, useState } from "react";
import SelectField from "../../components/Select/Select";
import useTable from "../../components/Table/Table";
import Button, {
  ActionButtonGroup,
  AddButton,
  FilterButton,
  FilterResetButton,
} from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { useFormField as useFieldAttributes } from "../../hooks/form";
import { toastSuccess, toastError } from "../../utils/SweetAlert";
import { addUSer, GetAllUsers, getDesignations, requestHandler } from "../../utils/api";
import InputField, { DragAndDropFileInput } from "../../components/Input/Input";
import { GetRoles } from "../../utils/api";
import { rolesModel } from "./Roles";
import { UpdateUser } from "../../utils/api";
import { dsignationModel } from "./Designation";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

class extras {
  desig_name : string = '';
  branch_name: string | null = null;
  role_name: string | null = null;
}

export class userModel extends extras{
  entity_id: number | null = null;
  branch_id: number | null = null;
  user_id: number | null = null;
  user_name: string | null = null;
  user_password: string | null = null;
  role_id: number | null = null;
  full_name: string | null = null;
  user_active: 1 | 0 = 0;
  desig_id : number | null = null;
  is_admin : 1 | 0 = 0; 
  is_superadmin : 1 | 0 = 0; 
  is_staff : 1 | 0 = 0; 
  login_req? : 0 | 1
  imageFile:File | null = null;
}

export class filterType {
  limit: number = 15;
  page: number = 0;
  user_name: string | null = "";
  role_id:number | null = null;
}

const Users = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<userModel>();
  const [roles, setRole] = useState<rolesModel[]>([]);
  const [dataArray, setdataArray] = useState<userModel[]>([]);
  const [designationMaster, setdesignationMaster] = useState<dsignationModel[]>([]);
  const [imageurl,setimageUrl]=useState('')
  const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
  const [modalOpen, setmodalOpen] = useState(false);
  const { Table,page,setPage } = useTable(() => {getAllUsers() // Pass page to API
  });
  const {user}=useAuth();
  const getFieldAttributes = useFieldAttributes({register,errors}) // for main form
  const ImageFilewatch=watch('imageFile');
  const roleWatch = watch('role_id')
  
  // FOR FILTER 
  const DefaultFilterValues = new filterType()
  const { register:filterRegister,handleSubmit:handleFilterSubmit, reset:filterReset,getValues } = useForm<filterType>({
    defaultValues:DefaultFilterValues
  });
  const getFilterAttributes = useFieldAttributes({register:filterRegister,errors});

  // function to get all entity
  function getAllUsers() {
    const formData=getValues();
    requestHandler(
      async () => {
        return await GetAllUsers({...formData ,page:Number(page)});
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

  // function to get all entity
  function getAllRoles() {
    return requestHandler(
      async () => {
        return await GetRoles();
      },
      (data) => {
        setRole(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }

  function getAllDesignations(){
    requestHandler(
      async () => {
          return await getDesignations();
      },
      (data) => {
        setdesignationMaster(data.data)
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
  const onFormSubmit = (formData : userModel )=>{
    if (action == "Add") {
      if( formData?.user_password && String(formData?.user_password)?.length < 6){
      toastError.fire({
          title: 'Password should be atleast 6 character',
        });
        return false
      }
      requestHandler(
        async () => {
          return await addUSer(formData);
        },
        (data) => {
          toastSuccess.fire({
            title: data.message,
          });
          getAllUsers();
          setmodalOpen(false);
          setaction('')
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      );
    } else if (action == "Edit") {
      if( formData.user_password && String(formData?.user_password)?.length < 6){
        toastError.fire({
            title: 'Password should be atleast 6 character',
          });
          return false
        }
      requestHandler(
        ()=>{return UpdateUser(formData)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllUsers();
          setmodalOpen(false)
          setaction('')
        },
        (errorMessage) => {
          toastError.fire({
            title: errorMessage,
          });
        }
      )
    }
  }

  // function to empty the "data" state
  function resetDatastate() {
    reset(new userModel());
  }

  function resetFilterStates(){
    filterReset(new filterType());
    getAllUsers();
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose() {
    setmodalOpen(false);
    setaction('');
    resetDatastate();
  }

   const onFilterFormSubmit = (formData: filterType)=>{
      // setPage(0)
      requestHandler(
        async () => {
          return await GetAllUsers({...formData,page:0});
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

   useEffect(() => {
    getAllUsers();
  }, [page]);
   
  useEffect(() => {
    getAllUsers();
    getAllRoles();
    getAllDesignations()
  }, []);

  useEffect(() => {
    if (action=='Edit') {
      reset((prev) => ({
        ...prev,
        user_password: '',
      }));
    }
  }, [action]);


  return (
    <div>
      {/* template header */}
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Users
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
              Add User
            </AddButton>
          </div>
        </div>

        <hr className ="my-3 border-gray-300 " />
        {/* ===== filter ===== */}
        <form
          noValidate
          onSubmit={
            handleFilterSubmit(onFilterFormSubmit)
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            <InputField
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
            </SelectField>
            <InputField
                label="Page limit"
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
              {/* <FilterButton onClick={()=>{}}></FilterButton> */}
              <FilterResetButton
                type="button"
                onClick={() => {
                  setPage(0);
                  resetFilterStates();
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
            <th>Full name</th>
            <th>User name</th>
            <th>Role</th>
            <th>Designation</th>
            <th>Profile image</th>
            <th>User active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            const {limit}=getValues();
            return (
              <tr key={index}>
                <td>{page * limit + (index + 1)}</td>
                <td title={_.user_id?.toString()}>
                  <b>{_.full_name}</b>
                </td>
                <td title={_.user_id?.toString()}>
                  <b>{_.user_name}</b>
                </td>
                {/* <td>{_.user_id}</td> */}
                <td>{_.role_name}</td>
                <td>{_.desig_name}</td>
                <td>
                  <img
                        src={
                          !_.imageFile
                            ? ""
                            : `${user?.s3_cloudfront_url}/${_?.imageFile}`
                        }
                        onClick={()=>{
                          Swal.fire({
                          imageUrl: `${user?.s3_cloudfront_url}/${_?.imageFile}`,
                          imageHeight: 300,
                          imageAlt: "User image",
                          showDenyButton: true, // Ensures the deny button is shown
                          denyButtonText: 'Close',
                          showConfirmButton: false,
                        })}}
                        className="object-cover w-10 h-10 rounded-full border border-yellow-600 cursor-pointer"
                        alt="User"
                    />
                </td>
                <td>
                  {_.user_active ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-green-300 px-2.5 py-0.5 text-black-700">
                      <p className="whitespace-nowrap text-sm">Yes</p>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-300 px-2.5 py-0.5 text-black-700">
                      <p className="whitespace-nowrap text-sm">No</p>
                    </span>
                  )}
                </td>
                <td width={"15%"}>
                  <ActionButtonGroup
                    onView={() => {
                      setaction("View");
                      reset(_);
                      setmodalOpen(true);
                    }}
                    onEdit={() => {
                      setaction("Edit");
                      reset(_);
                      // setdata((prevData) => ({
                      //   ...prevData,
                      //   imageFile:_.imageFile
                      // }));
                      setmodalOpen(true);
                    }}
                    view
                    edit
                    // deletee
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal for Add , Edit and View */}
      {modalOpen && (
        <Modal heading={`${action} User`} onClose={modalClose}>
          <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField
                  label="Full name"
                  {...getFieldAttributes("full_name",{
                    required:'Full name is required'
                  })}
                />
                  <SelectField
                  {...getFieldAttributes("role_id",{
                    required:'Role is required',
                    onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                      const RoleValue = e.target.value || "";
                      reset((prev) => ({
                        ...prev,
                        role_id: Number(RoleValue), 
                        user_name : null,
                        user_password : ''
                      }));
                    }
                  })}
                  label="Role"
                  // disabled={action != "Add"}
                >
                  <option value="">Select role </option>
                  {roles.filter(r =>r.is_active==1).map((role, i) => (
                    <option value={Number(role.role_id)} key={i}>
                      {role.role_name}
                    </option>
                  ))}
                </SelectField>
          {roles?.filter(_=>_.role_id == roleWatch)[0]?.login_req !=0 && 
              <>
                <InputField
                  disabled={action == 'Edit'}
                  label="User name (Used for login)"
                  {...getFieldAttributes("user_name",{
                    required:'User name is required'
                  })}
                />
                {action !== "View" && (
                   <InputField
                    // Password required only in 'Add' mode
                   label={`Password ${action === "Edit" ? "(If required)" : ""}`}
                   name="user_password"
                   {...getFieldAttributes('user_password',{
                    onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                      const pass = e.target.value || "";
                      reset((prev) => ({
                        ...prev,
                        user_password: pass, 
                      }));
                    }
                   })}
                   required={action == "Add"}
                 />
                )}
              </>
            }
                <SelectField
                  label="Designation"
                  {...getFieldAttributes("desig_id",{
                    required:'Designation is required'
                  })}
                >
                  <option value="">Select designation</option>
                  {designationMaster.filter(d=>d.is_active==1).map((_) => (
                    <option key={_.desig_id} value={_.desig_id?.toString()}>
                      {_.name}
                    </option>
                  ))}
                </SelectField>
            { action !='View' && <DragAndDropFileInput   file={ ImageFilewatch  } 
                // desc=`${}`"Upload user profile image "
                // desc={`${action=='Add' ? 'Upload user profile image':'Edit profile image'}`}
                fileTypeLable="Image"
                accept="image/*" 
                onFileUpload={(data : File)=>{
                  const imageUrl = URL.createObjectURL(data)
                  setimageUrl(imageUrl);
                  reset((prev) => ({
                      ...prev,
                      imageFile: data,
                    }));}
                }
              />}
                { action === 'Edit' && (
                        <div className="flex">
                            <div className="w-16 h-16 border mt-3 ml-10 border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                                <img 
                                    src={ imageurl ? imageurl :`${user?.s3_cloudfront_url}/${ImageFilewatch}`} 
                                    width={65} 
                                    height={50} 
                                    className="object-cover w-full h-full" 
                                    alt="Preview"
                                />
                            </div>
                        </div>
                    )}
                {action === "Edit" && (
                  <SelectField
                    {...getFieldAttributes("user_active",{
                      required :'Is active required'
                    })}
                    required
                    label="Is active"
                  >
                    <option value="0">In active</option>
                    <option value="1">Active</option>
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

export default Users;
