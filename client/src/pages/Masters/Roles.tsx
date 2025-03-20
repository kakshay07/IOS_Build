import { ChangeEvent, useEffect, useState } from "react";
import InputField from "../../components/Input/Input";
import useTable from "../../components/Table/Table";
import Button, { FilterButton, FilterResetButton } from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { useFormField as useFieldAttributes } from "../../hooks/form";
import { toastError, toastSuccess } from "../../utils/SweetAlert";
import { AddButton, ActionButtonGroup } from "../../components/Button/Button";
import {
  GetPagesForGivingAccess,
  GetRoles,
  requestHandler,
} from "../../utils/api";
import { addRoles } from "../../utils/api";
import { updateRoleAccess } from "../../utils/api";
import "../../components/Input/Input.css";
import SelectField from "../../components/Select/Select";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import React from "react";

class filterType{
  page:number = 0;
  limit:number =15;
  role_name:string  = '';
}

interface PageAccess {
  page_id: number;
  access_to_add?: number;
  access_to_update?: number;
  access_to_delete?: number;
  access_to_export?: number;

}
class ExtraActions {
  page_id:number | null = null;
  action_name: string | null = null;
  action_desc: string | null = null;
  action_id?: string | null = null;
}

export class rolesModel {
  entity_id: string | null = null;
  entity_name: string | null = null;
  role_id: string | null = null;
  role_name: string | null = null;
  is_superadmin: 1 | 0 = 0;
  is_admin: 1 | 0 = 0;
  is_staff: 1 | 0 = 0;
  is_active: 0 | 1 = 1;
  login_req : 0 | 1 = 1;
  page_access: PageAccess[] = [];
  extra_actions :ExtraActions[]=[];
  cr_by?: number;
  cr_on?: string;

  // LEVELS FOR IS_ADMIN
  level?: number | string = '';
  originalLevel?: number;
  originalRow?: rolesModel
  self_all: string = '';
  is_external: 0 | 1 = 0;
}

export class pagesModel {
  page_id: number | null = null;
  page_name: string | null = null;
  name: string | null = null;
  description: string | null = null;
  superadmin_only: 1 | 0 = 0;
  access_for_all: 1 | 0 = 0;
  access_to_add?: number;
  access_to_update?: number;
  access_to_delete?: number;
  access_to_export?: number;
  extra_actions: ExtraActions[] = [];
  cr_by?: number;
  cr_on?: string;
}

const Roles = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<rolesModel>();
  const [pages, setpages] = useState<pagesModel[]>([]);
  const [dataArray, setdataArray] = useState<rolesModel[]>([]);
  const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
  const [modalOpen, setmodalOpen] = useState(false);

  const getFieldAttributes = useFieldAttributes({ register, errors });
  // const isAdminWatch=watch('is_admin')
  const pageAccessWatch = watch("page_access");
  const extraActionWatch=watch('extra_actions');
  const isAdminWatch = watch('is_admin');

  const { Table,page,setPage } = useTable(() => {getAllRoles()});

  // FILTERS
  const DefaultFilterValues = new filterType();
const {
  register: filterRegister,
  handleSubmit: handleFilterSubmit,
  reset: filterReset,
  getValues
} = useForm<filterType>({
  defaultValues: DefaultFilterValues,
});
const getFilterAttributes = useFieldAttributes({
  register: filterRegister,
  errors,
});

  // function to get all entity
  function getAllRoles() {
    const filter = getValues() // GETS THE CURRENT VALUE OF FILTERTYPE
    requestHandler(
      async () => {
        return await GetRoles({...filter ,page:Number(page)});
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

  // custom Hook - handles form submission
  // we need to pass a callback function to "useOnSubmit" ,
  // that callback function will be called after validation of the form
  const onFormSubmit = (formData: rolesModel) => {
    if (user?.is_superadmin == 0) {
      formData.is_superadmin = 0;
    }
    if (
      Number(formData.is_admin) +
        Number(formData.is_staff) +
        Number(formData.is_superadmin) <
      1
    ) {
      toastError.fire(`Please select either admin or staff or internee`);
      return;
    }

    if (
      Number(formData.is_admin) +
        Number(formData.is_staff) +
        Number(formData.is_superadmin) >
      1
    ) {
      toastError.fire(
        `A role can either be ${
          user?.is_superadmin == 1 ? "Super admin or" : ""
        } admin or staff or internees.`
      );
    } else {
      if (action == "Add") {
        requestHandler(
          async () => {
            return await addRoles(formData);
          },
          (data) => {
            if (data.success) {
              toastSuccess.fire({
                title: data.message,
              });
              getAllRoles();
              setmodalOpen(false);
            } else {
              toastError.fire({
                title: data.message,
              });
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
          async () => {
            return await updateRoleAccess(formData);
          },
          (data) => {
            if (data.success) {
              toastSuccess.fire({
                title: data.message,
              });
              getAllRoles();
              setmodalOpen(false);
            }
          },
          (errorMessage) => {
            toastError.fire({
              title: errorMessage,
            });
          }
        );
      }
    }
  };

  const onFilterFormSubmit = (formData: filterType) => {
    setPage(0);
    requestHandler(
      async () => {
        return await GetRoles({...formData ,page:Number(page)});
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
  function resetFilterStates() {
    filterReset(new filterType());
    getAllRoles();
  }

  // function to empty the "data" state
  function resetDatastate() {
    reset(new rolesModel());
  }

  function modalClose() {
    setmodalOpen(false);
    resetDatastate();
  }

  function getAllPages() {
    requestHandler(
      async () => {
        return await GetPagesForGivingAccess();
      },
      (data) => {
        setpages(data.data);
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );
  }
  useEffect(() => {
    getAllPages();
  }, []);

  useEffect(() => {
    getAllRoles();
    setaction("");
  }, [page]);
  
  useEffect(() => {
  }, [extraActionWatch])
  

  const handlePageAccessCheckboxChange = (pageId: number) => {
    reset((prevState) => {
      const pageIndex = prevState.page_access.findIndex(
        (access) => access.page_id == pageId
      );

      let updatedPageAccess;
      if (pageIndex !== -1) {
        // If the page exists, remove it and reset all access fields
        updatedPageAccess = [...prevState.page_access];
        updatedPageAccess.splice(pageIndex, 1);
      } else {
        const page = pages.find((pag) => pag.page_id == pageId);
        updatedPageAccess = [
          ...prevState.page_access,
          {
            page_id: pageId,
            access_to_add: page?.access_to_add == 1 ? 1 : 0,
            access_to_update: page?.access_to_update == 1 ? 1 : 0,
            access_to_delete: page?.access_to_delete == 1 ? 1 : 0,
            access_to_export: page?.access_to_export == 1 ? 1 : 0,

          },
        ];
      }

      return { ...prevState, page_access: updatedPageAccess };
    });
  };

  const handleCheckboxChange = (pageId: number, field: keyof PageAccess) => {
    reset((prevState) => {
      const pageIndex = prevState.page_access.findIndex(
        (access) => access.page_id == pageId
      );

      let updatedPageAccess;
      if (pageIndex != -1) {
        updatedPageAccess = [...prevState.page_access];
        updatedPageAccess[pageIndex] = {
          ...updatedPageAccess[pageIndex],
          [field]: updatedPageAccess[pageIndex][field] == 1 ? 0 : 1,
        };
      } else {
        updatedPageAccess = [
          ...prevState.page_access,
          { page_id: pageId, [field]: 1 },
        ];
      }
      return { ...prevState, page_access: updatedPageAccess };
    });
  };

  const handleExtraActionCheckboxChange = (
    pageId: number,
    actionId: string | null,
    action_name:string,
    isChecked: boolean
  ) => {
    reset((prevState) => {
      const previousExtraActions = prevState.extra_actions.filter(
        (p) => !(p.page_id == pageId && p.action_id == actionId) 
      );

      if(isChecked){
        previousExtraActions.push({
          page_id: pageId,
          action_id: actionId,
          action_name: action_name, // Set this or remove based on your requirements
          action_desc: null, // Set this or remove based on your requirements
        })
      }
  
      return { ...prevState, extra_actions: previousExtraActions };
    });
  };
  
  return (
    <div>
      {/* template header */}
      <div className="px-4 py-1 mx-3 my-3 border rounded shadow ">
        {/* ===== Head ===== */}
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="py-5 pl-2 mt-3 text-2xl font-medium text-cyan-950 lg:mt-0">
              Roles
            </h2>
          </div>
          <div className="flex flex-wrap justify-start lg:justify-end">
            <AddButton
              onClick={() => {
                setaction("Add");
                resetDatastate();
                setmodalOpen(true);
              }}
            >
              Add Roles
            </AddButton>
          </div>
        </div>
        <hr className ="my-3 border-gray-300 " />
        <form
          noValidate
          onSubmit={handleFilterSubmit(onFilterFormSubmit)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            <InputField
              {...getFilterAttributes('role_name',{
                onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                  filterReset((prev) => ({ ...prev, role_name: e.target.value }));
                }
              })}
              name="role_name"
              label="Search by role name"
            />
            <InputField
              {...getFilterAttributes('limit',{
                onChange:(e:ChangeEvent<HTMLInputElement>)=>{
                  filterReset((prev) => ({ ...prev, limit: Number(e.target.value) }));
                }
              })}
              label="Page limit"
              name="limit"
              type="number"
              placeholder="Limit"
              min={0}
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
            <th>Role name</th>
            <th>Role label</th>
            <th>Role active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray
            .filter((_) =>
              user?.is_superadmin == 0
                ? _.is_staff == 1 || _.is_admin == 1
                : true
            )
            .map((_, index) => {
              const {limit} = getValues()
              return (
                <tr key={index}>
                  <td>{page*limit+(index + 1)}</td>
                  <td title={_.role_id?.toString()}><b>{_.role_name}</b></td>
                  <td>
                    <p className="flex items-center w-20 justify-center text-[12px] font-medium py-3 px-2 rounded-full text-blue-800 border border-blue-700 h-[15px] mt-1 whitespace-nowrap">
                      {_.is_admin == 1
                        ? "Admin"
                        : _.is_staff == 1
                        ? "Staff"
                        : _.is_superadmin == 1
                        ? "SuperAdmin"
                        : "-"}
                    </p>
                  </td>
                  <td>
                    {_.is_active == 1 ? (
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
                        reset({
                          ..._,
                        });
                        setmodalOpen(true);
                        window.scrollTo(0, 100);
                      }}
                      onDuplicate={() => {
                        setaction("Add");
                        reset({ ..._, role_name: "" });
                        setmodalOpen(true);
                      }}
                      view
                      edit
                      duplicate
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      {/* Modal for Add , Edit and View */}
      {modalOpen && (
        <Modal heading={`${action} Role`} onClose={modalClose}>
          <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset disabled={action == "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField
                  label="Role name"
                  placeholder="Admin"
                  {...getFieldAttributes("role_name", {
                    required: "Role name is required",
                  })}
                />
                {user?.is_superadmin == 1 && (
                  <>
                    {/* Super Admin: Show all fields */}
                    <SelectField
                      label="Is super admin"
                      {...getFieldAttributes("is_superadmin", {
                        required: "Is superadmin is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>
                    <SelectField
                      label="Is admin"
                      {...getFieldAttributes("is_admin", {
                        required: "Is admin is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>

                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Levels (High-Low)"
                        {...getFieldAttributes("level", {
                          required: "Level is required",
                        })}
                      >
                        <option value="">Select level</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                        <option value="5">Level 5</option>
                      </SelectField>
                    )}
                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Self/All task"
                        {...getFieldAttributes("self_all", {
                          required: "Self/All is required",
                        })}
                      >
                        <option value="">Select</option>
                        <option value="S">Self task</option>
                        <option value="A">All task</option>
                      </SelectField>
                    )}
                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Is external"
                        {...getFieldAttributes("is_external", {
                        required: "Is external is required",
                        })}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </SelectField>
                    )}

                    <SelectField
                      label="Is staff"
                      {...getFieldAttributes("is_staff", {
                        required: "Is staff is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>
                  </>
                )}

                {user?.is_superadmin !== 1 && (
                  <>
                    <SelectField
                      label="Is admin"
                      {...getFieldAttributes("is_admin", {
                        required: "Is admin is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>

                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Levels (High-Low)"
                        {...getFieldAttributes("level", {
                          required: "Level is required",
                        })}
                      >
                        <option value="">Select level</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                        <option value="5">Level 5</option>
                      </SelectField>
                    )}
                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Self/All task"
                        {...getFieldAttributes("self_all", {
                          required: "Self/All is required",
                        })}
                      >
                        <option value="">Select</option>
                        <option value="S">Self task</option>
                        <option value="A">All task</option>
                      </SelectField>
                    )}
                    {isAdminWatch == 1 && (
                      <SelectField
                        label="Is external"
                        {...getFieldAttributes("is_external", {
                        required: "Is external is required",
                        })}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </SelectField>
                    )}

                    <SelectField
                      label="Is staff"
                      {...getFieldAttributes("is_staff", {
                        required: "Is staff is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>
                  </>
                )}
                 <SelectField
                      label="Is login required"
                      {...getFieldAttributes("login_req", {
                        required: " required",
                      })}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </SelectField>

                {action == "Edit" && (
                  <>
                    <SelectField
                      label="Is active"
                      {...getFieldAttributes("is_active", {
                        required: "Is active is required",
                      })}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </SelectField>
                  </>
                )}
              </div>

              {/* <Checkbox onChange={()=>{setdata(prev => ( {...prev , superadmin_only : prev.superadmin_only  == 1 ? 0 : 1} ))}} checked={data.superadmin_only }   />
              <InputField required label="page Names" placeholder="/profile" {...FieldAttributes('page_name')} /> */}
              {/* {<label className='w-full' htmlFor="app-input-field"><span style={{color:'red'}}>*</span></label> } */}
              <label
                className="grid ml-3 mr-4 mb-9"
                style={{ fontSize: "14.5px" ,fontWeight:'bold' }}
              >
                Accesses to pages
              </label>

              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {user?.is_superadmin === 1 && <th>Description</th>}
                    <th>Page access </th>
                    <th >Access to add</th>
                    <th>Access to edit</th>
                    <th>Access to delete</th>
                    <th>Access to export</th>
                    <th>Extra action button</th>
                  </tr>
                </thead>
                <tbody>
                  {pages
                    .filter((page) => page.superadmin_only == 0)
                    .map((page) => (
                      <tr key={page.page_id}>
                        <td>
                          <label className="ml-2">{page.name}</label>
                        </td>
                        {user?.is_superadmin == 1 && (
                          <td>
                            <label className="ml-2">
                              {page.description ? page.description : "-"}
                            </label>
                          </td>
                        )}
                        <td>
                          <div className="grid ml-7">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handlePageAccessCheckboxChange(
                                  Number(page.page_id)
                                )
                              }
                              checked={pageAccessWatch.some(
                                (access) => access.page_id == page.page_id
                              )}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                            {page.access_to_add == 1 && (
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(
                                    Number(page.page_id),
                                    "access_to_add"
                                  )
                                }
                                checked={pageAccessWatch.some(
                                  (access) =>
                                    access.page_id == page.page_id &&
                                    access.access_to_add == 1
                                )}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                            {page.access_to_update == 1 && (
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(
                                    Number(page.page_id),
                                    "access_to_update"
                                  )
                                }
                                checked={pageAccessWatch.some(
                                  (access) =>
                                    access.page_id == page.page_id &&
                                    access.access_to_update == 1
                                )}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="grid ml-7">
                            {page.access_to_delete == 1 && (
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(
                                    Number(page.page_id),
                                    "access_to_delete"
                                  )
                                }
                                checked={pageAccessWatch.some(
                                  (access) =>
                                    access.page_id == page.page_id &&
                                    access.access_to_delete == 1
                                )}
                              />
                            )}
                          </div>
                          </td>
                          <td>
                          <div className="grid ml-7">
                            {page.access_to_export == 1 && (
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(
                                    Number(page.page_id),
                                    "access_to_export"
                                  )
                                }
                                checked={pageAccessWatch.some(
                                  (access) =>
                                    access.page_id == page.page_id &&
                                    access.access_to_export == 1
                                )}
                              />
                            )}
                          </div>
                          </td>
                          <td>
                          <div className="flex">
                            { page.extra_actions.length > 0 ? page.extra_actions.map((action, index) => (
                                <React.Fragment key={index}>
                              <div 
                                key={index} 
                                style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',  
                                  alignItems: 'center',      
                                  marginRight: '10px'       
                                }}
                              >
                                <label 
                                  htmlFor={`action_name_${index}`} 
                                  style={{ marginBottom: '4px'}} 
                                >
                                  {action.action_desc}
                                </label>
                                
                                <input 
                                  style={{ height: '15px' }} 
                                  type="checkbox" 
                                  id={`action_name_${index}`} 
                                  name="action_name"
                                  onChange={(e) =>{
                                    handleExtraActionCheckboxChange(
                                      page.page_id!,
                                      action.action_id!, // Passing page_id from the page
                                      action.action_name!, // Passing action_name from ExtraActions
                                      e.target.checked // Pass whether the checkbox is checked (true or false)
                                    )
                                  }}
                                  checked={extraActionWatch.some(
                                    (access) =>
                                      access.page_id == page.page_id && access.action_id == action.action_id
                                  )}
                                />
                              </div>
                                {index < page.extra_actions.length - 1 && (
                                <div className="mx-5 border border-gray-300"></div>
                              )}
                            </React.Fragment>
                            )) : <i title='No extra actions' className="fas fa-unlink"></i>}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
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

export default Roles;
