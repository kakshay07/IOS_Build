import {ChangeEvent, useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { useFormField as useFieldAttributes } from "../../hooks/form";
import useTable from '../../components/Table/Table';
import Button, { ActionButtonGroup, AddButton, FilterButton, FilterResetButton } from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import SelectField from '../../components/Select/Select';
import InputField from '../../components/Input/Input';
import { requestHandler, TypesApis } from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/SweetAlert';
import { MachineNames, relatedTypesLabel, TypesLabel } from '../../utils/Constant';

class filterType{
    type_name:string = '';
    page:number = 0;
    limit:number =15;
}
  class extras{
    types_count?:number;
  }
 export class typeModel extends extras{
  entity_id?: number | null = null;
  branch_id?: number | null = null;
  sl?:number | null = null;
  machine_name:string | null = null;
  type_name : string | null = null;
  type_desc : string | null = null;
  measure_unit:string | null = null;

  is_active ?:number;
  cr_on?:string;
  cr_by?:number;

 }

export const TypeMaster = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
      } = useForm<typeModel>();
    const [dataArray, setdataArray] = useState<typeModel[]>([]);
    const [typesArray, setTypesArray] = useState<typeModel[]>([]);
    const [action, setaction] = useState<"Add" | "Edit" | "View" | "">("");
    const [modalOpen, setmodalOpen] = useState(false);
    const getFieldAttributes = useFieldAttributes({ register, errors });
    const MachineWatch =watch('machine_name')
    const { Table, page, setPage } = useTable(() => {
        getAllTypes()
      });

    //   FOR FILTER
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
 

      function getAllTypes(){
        const filter = getValues()
        requestHandler(
            async () => {
              return await TypesApis.GetAllTypes({...filter ,page:Number(page)});
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


  const onFormSubmit = (formData: typeModel) => {
    setTypesArray((prev)=>[
        ...prev,
        {   machine_name:formData.machine_name,
            type_name: formData.type_name,
            type_desc: formData.type_desc,
            measure_unit: formData.measure_unit
        }
    ]);
    reset((prev)=>({
        ...prev,
        type_desc:'',
        measure_unit:''
    }))
  } 

    const onFilterFormSubmit = (formData: filterType) => {
        setPage(0);
        requestHandler(
          async () => {
            return await TypesApis.GetAllTypes({...formData ,page:Number(page)});
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
        getAllTypes();
    }

    function resetDatastate() {
        reset(new typeModel());
      }

    function modalClose() {
        setmodalOpen(false);
        resetDatastate();
        reset(new typeModel());
        setTypesArray([]);
      }

    function HandleAddTypes(){
        if(typesArray.length < 1){
            toastError.fire({
                title:'Please add atleast one types'
            });
            return false
        }
        requestHandler(
            async () => {
              return await TypesApis.AddTypesData(typesArray);
            },
            (data) => {
              if (data.success) {
                toastSuccess.fire({
                  title: data.message,
                });
                setmodalOpen(false);
                getAllTypes();
                resetDatastate()
              }
            },
            (errorMessage) => {
              toastError.fire({
                title: errorMessage,
              });
            }
          );
    }

    function HandleUpdateTypes(){
        if(typesArray.length < 1){
            toastError.fire({
                title:'Please add atleast one types'
            });
            return false
        }
        requestHandler(
            async () => {
              return await TypesApis.UpdateTypesData(typesArray);
            },
            (data) => {
              if (data.success) {
                toastSuccess.fire({
                  title: data.message,
                });
                setmodalOpen(false);
                getAllTypes();
                resetDatastate()
              }
            },
            (errorMessage) => {
              toastError.fire({
                title: errorMessage,
              });
            }
          );
    }

    const handleOnEditRow =(types:typeModel)=>{
        setaction('Edit');
        setmodalOpen(true);
        reset((prev)=>({
            ...prev,
            type_name:types.type_name,
            machine_name:types.machine_name
        }))
        handleGetAllDataOfTypeName(String(types.type_name) , String(types.machine_name))
    }
    const handleOnViewRow =(types:typeModel)=>{
        setaction('View');
        setmodalOpen(true);
        handleGetAllDataOfTypeName(String(types.type_name) , String(types.machine_name))
    }
    

    function handleGetAllDataOfTypeName(typeName:string ,machine_name:string){ 
        requestHandler(
          async () => {
            return await TypesApis.FetchTypesByTypename(typeName,machine_name);
          },
          (data) => {
           setTypesArray(data.data)
          },
          (errorMessage) => {
            toastError.fire({
              title:errorMessage,
            })
          }
        )
      }

      function MarkActiveInactiveStatus(type_name:string,is_active: number){
        requestHandler(
            async () => {
              return await TypesApis.MarkActiveInactive(type_name,is_active);
            },
            (data) => {
              if (data.success) {
                toastSuccess.fire({
                  title: data.message,
                });
                getAllTypes()
              }
            },
            (errorMessage) => {
              toastError.fire({
                title: errorMessage,
              });
            }
          );
      }

      const relatedTypes = MachineWatch
      ? relatedTypesLabel[MachineWatch as keyof typeof relatedTypesLabel] || []
      : [];

    useEffect(() => {
        getAllTypes();
    }, [page])
    
  return (
    <div>
      <div className="mx-3 my-3 shadow px-4 py-1 border rounded ">
        {/* ===== Head ===== */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-cyan-950 pl-2 mt-3 lg:mt-0 py-5">
              Measurements
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
              Add Types
            </AddButton>
          </div>
        </div>
        <hr className="my-3 border-gray-300 " />
        <form
          noValidate
          onSubmit={
            handleFilterSubmit(onFilterFormSubmit)
          }
        >
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-5 items-end">
            <SelectField
                  label="Type"
                  {...getFilterAttributes("type_name")}
                >
                  <option value="">Select type</option>
                  <option value="C">Color</option>
                  <option value="W">Width</option>
                  <option value="M">Micron</option>
                  <option value="Y">Yarn</option>
                  <option value="B">Bag size</option>
            </SelectField>
            <InputField
                label='Page limit'
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
                  setPage(0);
                }}
              ></FilterResetButton>
              <FilterButton onClick={() => {}}></FilterButton>
            </div>
          </div>
        </form> 
      </div>
      {/* TABLE */}
      <Table pagination>
        <thead>
          <tr>
            <th>Sl</th>
            <th>Type</th>
            <th>Types count</th>
            <th>Machine</th>
            <th>Is active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((_, index) => {
            const {limit} =getValues()
            return (
              <tr key={index}>
                <td>{ limit* page +(index + 1)}</td>
                <td><b>{TypesLabel(_.type_name)}</b></td>
                <td>{_.types_count}</td>
                <td>{MachineNames(_.machine_name)}</td>
                <td>{<button type="button" onClick={()=>MarkActiveInactiveStatus(String(_.type_name),Number(_.is_active))}><i title={_.is_active==1 ? 'Yes' : 'No'}className={`fa-solid ${_.is_active == 0 ? `fa-xmark text-red-600` : 'fa-check text-green-600'} text-2xl border rounded-lg`}></i></button>}</td>
                <td width={"15%"}>
                  <ActionButtonGroup
                    onView={() => {handleOnViewRow(_)}}
                    onEdit={() => {handleOnEditRow(_)}}
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
      {modalOpen && (
        <Modal heading={`${action} Types`} onClose={modalClose}>
          <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset disabled={action === "View"}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              <SelectField
                  disabled={action == "Edit"}
                  {...getFieldAttributes("machine_name", {
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      const selectedValue = e.target.value;
                      reset((prev) => ({
                        ...prev,
                        machine_name: selectedValue,
                        type_name: '',
                        type_desc: '',
                        measure_unit: ''
                      }));
                    },
                    required: "Machine is required",
                  })}
                  required
                  label=" Machines"
                >
                  <option value="">Select machine </option>
                  <option value="E">Extrusion machine</option>
                  <option value="K">Knitting machine</option>
                  <option value="C">Clipping machine</option>
                </SelectField>
                <SelectField
                  disabled={action=='Edit'}
                  label="Type"
                  {...getFieldAttributes("type_name", {
                    required: "required",
                  })}
                >
                  <option value="">Select type</option>
                  {relatedTypes.map((typeKey) => (
                    <option key={typeKey} value={typeKey}>
                      {TypesLabel(String(typeKey))}
                    </option>
                  ))}
                </SelectField>
                <InputField
                  styleClass="col-span-1 md:col-span-2"
                  label="Type description"
                  disabled={action=='Edit'}
                //   placeholder="630 + /"
                  {...getFieldAttributes("type_desc", {
                    required: "Description is required",
                  })}
                />
                <SelectField
                  label="Measuring unit"
                  {...getFieldAttributes("measure_unit")}
                >
                  <option value="">Select unit</option>
                  <option value="mm">mm</option>
                  <option value="inch">inch</option>
                </SelectField>
                {/* {action=='Edit' &&
                    <SelectField
                        label="Is active"
                        {...getFieldAttributes("is_active")}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </SelectField>
                } */}
              </div>
              <div className='inline-flex justify-end w-full '>
                { action!='View' && 
                <button
                className="inline-flex justify-end  gap-2 mr-5 mb-10 rounded border border-green-900 bg-green-800 px-6 py-2 text-white hover:bg-transparent hover:text-green-900 focus:outline-none hover:focus:ring active:text-indigo-500 right-1 my-3"
                >
                Add
                </button>
                }
              </div>
              <Table>
                <thead>
                  <tr >
                    <th>Sl</th>
                    <th>Machine</th>
                    <th>Type name</th>
                    <th>Type description</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {typesArray.map((_, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{MachineNames(_.machine_name)}</td>
                        <td>{TypesLabel(_.type_name)}</td>
                        <td>{_.type_desc}</td>
                        <td>{_.measure_unit ? _.measure_unit : '-'}</td>
                        <td width={"15%"}>
                          <ActionButtonGroup 
                          onDelete={()=>{
                            setTypesArray((prev) => prev.filter((_, i) => i !== index));
                          }}
                          deletee />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </fieldset>
            <hr className="mt-4 border-gray-300 " />
            <div className="flex justify-end">
              <Button onClick={modalClose} varient="light" type="button">
                Cancel
              </Button>
              {action=='Add' && <Button varient="blue" type="button" onClick={HandleAddTypes}>Submit</Button>} 
              {action=='Edit' && <Button varient="blue" type="button" onClick={HandleUpdateTypes}>Update</Button>} 
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
