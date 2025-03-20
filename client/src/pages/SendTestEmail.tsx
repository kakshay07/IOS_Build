import InputField from "../components/Input/Input"
import { requestHandler, sendTestEmail } from "../utils/api"
import { toastError, toastSuccess } from "../utils/SweetAlert"
import { useAuth } from "../contexts/AuthContext"
import { useForm } from "react-hook-form"
import { useFormField as useFieldAttributes } from "../hooks/form";


const SendTestEmail = () => {
     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<{ to_email: string }>();
      const getFieldAttributes = useFieldAttributes({ register, errors });
    
//   const [data, setdata] = useState({
//     to_email : ''
//   })
  const {currentEntity} =  useAuth();
  const onFormSubmit = (formData: {to_email:string}) => {
    requestHandler(
      async ()=>{ return await sendTestEmail({...formData, entity_id : Number(currentEntity)})},
      (data)=>{
        if(data.success){
          toastSuccess.fire({
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
  };

  return (
    <div className="p-3">
      <b>SendDemoEmail</b>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <InputField name="to_email" label="To Email" 
        // value={data.to_email} onChange={(e)=>{setdata(prev => ({...prev , to_email : e.target.value}))}}
        {...getFieldAttributes('to_email')}
         />
        <button className="bg-blue-300 p-3">Send</button>
      </form>
    </div>
  )
}

export default SendTestEmail