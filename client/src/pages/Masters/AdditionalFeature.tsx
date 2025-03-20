import { useEffect, useState } from "react"
import SelectField from "../../components/Select/Select"
import useTable from "../../components/Table/Table"
import Button, {ActionButtonGroup, AddButton} from "../../components/Button/Button"
import Modal from "../../components/Modal/Modal"
import { useFormField as useFieldAttributes } from "../../hooks/form"
import {  toastError, toastSuccess } from "../../utils/SweetAlert"
import { AddAdditonalFeature, GetAllAdditionalFeature,  UpadateAdditonalFeature, requestHandler } from "../../utils/api"
import InputField from "../../components/Input/Input"
import { useForm } from "react-hook-form"

// class filterType{
//   page:number = 0;
//   limit:number =15;
//   name:string  = '';
// }

export class additionaFeatureModel {
    feature_name: string | '' = '';
    feature_type: string = '';
    is_active: 0 | 1 = 1;
}
const AdditionalFeature = () => {
//   const [data, setdata] = useState<additionaFeatureModel>(new additionaFeatureModel());
  const [dataArray, setdataArray] = useState<additionaFeatureModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)
//   const [filter,setFilter]=useState<filterType>(new filterType());
  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table} = useTable(()=>{getAllAdditionalFeature()});
  const { register, handleSubmit, formState: { errors }, reset } = useForm<additionaFeatureModel>();
  const getFieldAttributes = useFieldAttributes({register,errors})
    

  function getAllAdditionalFeature(){
    requestHandler(
      async () => {
          return await GetAllAdditionalFeature();
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
//   const onFormSubmit = useOnSubmit(()=>{
  const onFormSubmit = (formData : additionaFeatureModel )=>{
    if(action == 'Add'){
      requestHandler(
        async ()=>{ return await AddAdditonalFeature(formData)},
        (data)=>{
          if(data.success){
            toastSuccess.fire({
              title : data.message 
            })
            getAllAdditionalFeature()
            setmodalOpen(false)
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
        ()=>{return UpadateAdditonalFeature(formData)},
        (data)=>{
          toastSuccess.fire({
            title : data.message
          })
          getAllAdditionalFeature()
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

  // function to empty the "data" state 
  function resetDatastate(){
    reset(new additionaFeatureModel());
  }

  // function to pass to the modal close button
  // this closes the modal and clears the "data" state
  function modalClose(){
    setmodalOpen(false);
    resetDatastate()
  }

  useEffect(() => {
    getAllAdditionalFeature();
  }, []);
  

  return (
    <div>

      {/* template header */}
      <div className="px-4 py-1 mx-3 my-3 border rounded shadow ">

        {/* ===== Head ===== */}
        <div className="flex flex-wrap items-center justify-between">
          <div><h2 className="py-5 pl-2 mt-3 text-2xl font-medium text-cyan-950 lg:mt-0">Additional Features Master</h2></div>
          <div className="flex flex-wrap justify-start lg:justify-end" >
            <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Feature</AddButton>
          </div>
        </div>
        <hr className ="my-3 border-gray-300 " />
      </div>  

      {/* ===== Table ===== */}
      <Table pagination>
        <thead>
          <tr>
            <td>Sl</td>
            <th>Feature name</th>
            <th>Feature type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {
            dataArray.map((_ ,index)=>{
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{_.feature_name}</td>
                  <td>{_.feature_type == "W"&& <i className="fa-brands fa-whatsapp text-xl text-green-600"></i> || _.feature_type == "S" && <i className="fa-regular fa-comment-dots text-xl text-gray-600"></i> || _.feature_type == "E" && <i className="fa-regular fa-envelope text-lg text-blue-500"></i>}</td>
                  <td>
                    {
                      _.is_active ? 
                        <span className="inline-flex items-center justify-center rounded-full bg-green-200 px-2.5 py-0.5 text-black-700" >
                            <p className="whitespace-nowrap text-sm">Active</p>
                        </span> : 
                        <span
                            className="inline-flex items-center justify-center rounded-full bg-red-200 px-2.5 py-0.5 text-black-700"
                        >
                            <p className="whitespace-nowrap text-sm">Inactive</p>
                        </span>
                    }
                  </td>
                  <td width={'15%'}>
                    <ActionButtonGroup
                      onView={()=>{
                          setaction('View');
                          reset(_)
                          setmodalOpen(true);
                        }
                      }
                      onEdit={()=>{
                          setaction('Edit');
                          reset(_);
                          setmodalOpen(true);
                        }
                      }
                      view
                      edit
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
      <Modal heading={`${action} Additional Feature`} onClose={modalClose}>
        <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
               {action != "Edit" &&
                <InputField  label="Feature name" {...getFieldAttributes('feature_name',{
                    required :'This field is required'
                })}
                />
            }
            {action != "Edit" &&
              <SelectField {...getFieldAttributes('feature_type',{
                required:'This field is required'
              })}  label="Feature type">
                <option value="">Select</option>
                <option value="W">Whatsapp</option>
                <option value="E">Email</option>
                <option value="S">SMS</option>
              </SelectField>
                }

              <SelectField {...getFieldAttributes("is_active")}
              label = "Is active"  disabled = {action == "Add"}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </SelectField>
              
            </div> 
          </fieldset>
          <hr className="mt-4 border-gray-300 " />
          <div className="flex justify-end">
            <Button onClick={modalClose} varient="light" type="button">Cancel</Button>
            <Button varient="blue">Submit</Button>
          </div>
        </form>
      </Modal>}
    </div>
  )
}

export default AdditionalFeature