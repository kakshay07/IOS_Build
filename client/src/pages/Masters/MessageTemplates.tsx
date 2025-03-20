import { useEffect, useState } from "react"
import SelectField from "../../components/Select/Select"
import useTable from "../../components/Table/Table"
import Button, {ActionButtonGroup} from "../../components/Button/Button"
import Modal from "../../components/Modal/Modal"
import {  toastError, toastSuccess } from "../../utils/SweetAlert"
import { UpadateAdditonalFeatureTemplate, getAdditionalAccessOfEntity, requestHandler } from "../../utils/api"
import InputField from "../../components/Input/Input"
import { useAuth } from "../../contexts/AuthContext"
import { useForm } from "react-hook-form"
import { useFormField as useFieldAttributes } from "../../hooks/form"


// class filterType{
//   page:number = 0;
//   limit:number =15;
//   name:string  = '';
// }

export class mainModel {
    feature_name: string | '' = '';
    feature_type: string = '';
    template_subject: string = '';
    template_body: string = '';
}
const MessageTemplates = () => {
  const [dataArray, setdataArray] = useState<mainModel[]>([]);
  const [action, setaction] = useState<'Add' |'Edit' | 'View' | ''>('');
  // state used to handle modal open state
  const [modalOpen, setmodalOpen] = useState(false)
//   const [filter,setFilter]=useState<filterType>(new filterType());
  // Custom Hook - gives a "table" component and current page number and a function to change the current page
  const {Table} = useTable(()=>{getAllAdditionalFeature()});
  const {currentEntity} = useAuth();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<mainModel>(); 
  const getFieldAttributes = useFieldAttributes({register,errors});
  const featuretypewatch =watch('feature_type')
    
  


  function getAllAdditionalFeature(){
    requestHandler(
      async () => {
          return await getAdditionalAccessOfEntity({
            entity_id : Number(currentEntity)
          });
      },
      (data) => {
        console.log(data.data,"is this data");
        
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
  const onFormSubmit = (formData : mainModel )=>{
    if(action == 'Add'){
      // requestHandler(
      //   async ()=>{ return await AddAdditonalFeature(data)},
      //   (data)=>{
      //     if(data.success){
      //       toastSuccess.fire({
      //         title : data.message 
      //       })
      //       getAllAdditionalFeature()
      //       setmodalOpen(false)
      //     }
      //   },
      //   (errorMessage)=>{
      //     toastError.fire({
      //       title : errorMessage
      //     })
      //   }
      // )
    } else if(action == 'Edit') { 
      requestHandler(
        ()=>{return UpadateAdditonalFeatureTemplate(formData)},
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
    reset(new mainModel());
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
          <div><h2 className="py-5 pl-2 mt-3 text-2xl font-medium text-cyan-950 lg:mt-0">Message Templates</h2></div>
          <div className="flex flex-wrap justify-start lg:justify-end" >
            {/* <AddButton onClick={()=>{setaction('Add');resetDatastate();setmodalOpen(true)}}>Add Feature</AddButton> */}
          </div>
        </div>
        {/* <hr className ="my-3 border-gray-300 " /> */}
      </div>  

      {/* ===== Table ===== */}
      <Table pagination>
        <thead>
          <tr>
            <td>Sl</td>
            <th>Feature name</th>
            <th>Feature type</th>
            <th>Status</th>
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
      <Modal heading={`${action} Template`} onClose={modalClose}>
        <form noValidate onSubmit={handleSubmit(onFormSubmit)}>
          <fieldset disabled={action === 'View'}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <InputField  label="Feature name" {...getFieldAttributes('feature_name',{
                    required:'This is required'
                })} disabled/>
                <SelectField {...getFieldAttributes('feature_type',{
                    required:'This is required'
                })} required label="Feature type" disabled>
                  <option value="">Select</option>
                  <option value="W">Whatsapp</option>
                  <option value="E">Email</option>
                  <option value="S">SMS</option>
                </SelectField>
                {
                 featuretypewatch == 'E' &&
                  <InputField label="Email Subject" styleClass="col-span-1 md:col-span-4 "  {...getFieldAttributes('template_subject')}/>
                }
                <InputField label={featuretypewatch == 'E' ? "Email Body" : 'SMS Body'} styleClass="col-span-1 md:col-span-4  [&_textarea]:h-auto"  type="textarea" {...getFieldAttributes('template_body')}/>
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

export default MessageTemplates