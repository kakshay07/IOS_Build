import Button from "../components/Button/Button";
import InputField, { DragAndDropFileInput } from "../components/Input/Input";
import { useState } from "react";
import { requestHandler, UpdateProfileImg } from "../utils/api";
import { toastSuccess } from "../utils/SweetAlert";
import { toastError } from "../utils/SweetAlert";
import { GetAllUsers } from "../utils/api";
import profileImg from "../../public/profile.png";
import { changePassword } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal/Modal";
import { useForm } from "react-hook-form";
import { useFormField as useFieldAttributes } from "../hooks/form"


export class ProfileImageModel{
  user_name:string | null = null;
  user_id:number | null = null;
  entity_id:number | null = null;
  branch_id:number | null = null
  imageFile:File | null = null
} 

export class changepasswordmodel {
  user_password: string = "";
  // user_id:string=''
  confirmPassword:string  = ''
}

const ChangePassword = () => {
  const {user,setUser} = useAuth();
  // const [data, setData] = useState<changepasswordmodel>(
  //   new changepasswordmodel()
  // );
  const [imageurl,setimageUrl]=useState('')
  const [modalOpen, setmodalOpen] = useState(false);
  const [imgfile, setimgfile] = useState<ProfileImageModel>(new ProfileImageModel())
  // const [confirmPassword, setConfirmPassword] = useState("");

  const { register, handleSubmit, formState: { errors }, reset,watch } = useForm<changepasswordmodel>();
  const getFieldAttributes = useFieldAttributes({register,errors});
  const passwrodWatch=watch('user_password')
  const ConfirmPassWatch=watch('confirmPassword');

  // const handleConfirmPasswordChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  // ) => {
  //   setConfirmPassword(event.target.value);
  // };

  const validatePasswords = (): boolean => {
    if (passwrodWatch != ConfirmPassWatch) {
      console.log(passwrodWatch , ConfirmPassWatch , " true or false")
      // setErrorMessage("Passwords do not match");
      toastError.fire({
        title: "password do not match",
      });
      return false;
    }
    return true;
  };

  const onFormSubmit = (formData:changepasswordmodel)=>{
    console.log(formData ," formadara")
    if (!validatePasswords()) return;
    const { confirmPassword, ...dataToSend } = formData;
    console.log(confirmPassword );
    requestHandler(
      async () => {
        return await changePassword(dataToSend);
      },
      (responseData) => {
        toastSuccess.fire({
          title: responseData.message,
        });
        GetAllUsers();
        reset(new changepasswordmodel())
      },
      (errorMessage) => {
        // console.log(errorMessage, "errorMessage");

        toastError.fire({
          title: errorMessage,
        });
      }
    );
  };

  
  const handleOpenProfileEdit = () => {
    setmodalOpen(true);
  }

  const handleProfileModalClose = () => {
    setmodalOpen(false);
    setimageUrl('')
  }


  const handleFileChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setimageUrl(imageUrl);
    setimgfile((prev) => ({
      ...prev,
      imageFile: file, 
    }));
    // const imageUrl = URL.createObjectURL(file);
    // setimageUrl(imageUrl);
    // console.log(file.name, file.size, file.type); 
    // alert(file.name)
};

  function HandleUpdateProfileImage(){
    if(!imgfile.imageFile){
      toastError.fire({
        title: 'Please input the image file and submit',
      });
      return false;
    }
    requestHandler(
      async () => {
        return await UpdateProfileImg({
          entity_id: Number(user?.entity_id),
          branch_id: Number(user?.branch_id),
          user_name: String(user?.user_name),
          imageFile: imgfile.imageFile,
          oldImgUrl: String(user?.imageFile),
        });
      },
      (responseData) => {
        setUser((prevUser) => {
          if (!prevUser) return prevUser; 
          const newUpdatedUserImage={...prevUser,
            imageFile: responseData.data}
          localStorage.setItem('users',JSON.stringify(newUpdatedUserImage))
          return newUpdatedUserImage;
      });
      setmodalOpen(false)
        toastSuccess.fire({
          title: responseData.message,
        });
        GetAllUsers();
      },
      (errorMessage) => {
        toastError.fire({
          title: errorMessage,
        });
      }
    );

  }

  return (
    <>
    <div className="flex justify-center mt-32 align-center">
      <div className="md:flex">
        <div className="flex flex-col items-center md:m-10 md:pr-20 md:border-l-0 md:border md:border-r-black-800 md:border-y-0">
        <div className="relative overflow-hidden  rounded-full border profileWrapper group">
        <img 
            src={user?.imageFile ? `${user.s3_cloudfront_url}/${user.imageFile}` : profileImg} 
            className="h-[150px] w-[150px]" 
            alt="User Profile" 
          />
          {/* <img className="w-[150px]" src={profileImg} alt="" /> */}
          <div className="overlay bg-[#0000008a] w-full h-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <p className="font-semibold text-gray-200 cursor-pointer" onClick={handleOpenProfileEdit}>
              <i className="mr-1 fa-solid fa-pen-to-square"></i>
              Edit
            </p>
          </div>
        </div>
        <div>
          <h2 className="mt-2 text-lg font-bold text-center">{user?.user_name}</h2>
          <h2 className="mt-1 font-medium text-center text-blue-800 text-md">{user?.role_name}</h2>
        </div>
        </div>
        <div className="pt-8 md:pl-12">
        <form className="flex flex-col items-center justify-center md:flex-none md:items-start " onSubmit={handleSubmit(onFormSubmit)}>
          <InputField
          styleClass=" w-[18em] md:w-[25em]"
            label="New password"
            type="password"
            {...getFieldAttributes("user_password" ,{
              required:'New password is required'
            })}
          />
          <InputField
            styleClass=" w-[18em] md:w-[25em] "
            type="password"
            label="Confirm password"
            {...getFieldAttributes("confirmPassword" ,{
              required:'Confirm password is required'
            })}

            name="Confirm Password"
          />
          <Button  varient="blue">Submit</Button>
        </form>
        </div>
      </div>
    </div>
    {
      modalOpen && 
      <Modal  styleClass="smallModal" heading='Edit Profile Picture' onClose={handleProfileModalClose}>
          <div className="flex items-center justify-center mt-3">
            <div className="relative overflow-hidden border rounded-full profileWrapper group">
              <img className="w-[150px] h-[150px]"  src={imageurl? imageurl : `${user?.s3_cloudfront_url}/${user?.imageFile}`}  alt="" />
            </div>
          </div>
          <form action="">
            <div className="mt-6"></div>
            <DragAndDropFileInput file={imgfile.imageFile} 
            accept={['.png' ,'.jpg' , '.jpeg']} fileTypeLable="Image"  onFileUpload={handleFileChange} />
            <div className="flex justify-center">
            <Button varient="blue" type="button" onClick={()=>{HandleUpdateProfileImage()}} >Submit </Button>
              </div>
          </form>
      </Modal>
    }
  </>

  );
};

export default ChangePassword;
