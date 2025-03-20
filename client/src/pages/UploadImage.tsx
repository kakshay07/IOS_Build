// import { axios } from "../utils/axios";

const UploadImage = () => {

    // const onSelectFile = async (event : React.ChangeEvent<HTMLInputElement>) => {
    //     if(event.target.files){
    //         const file = event.target.files[0];
    //         const convertedFile = await convertToBase64(file);
    //         const s3URL = await axios.post(
    //             '/s3/upload/image',
    //             {
    //                 image: convertedFile,
    //                 imageName: file.name,
    //                 type : file.type
    //             }
    //         );
    //         alert(s3URL.data.link);
    //     }
    // }

    // const convertToBase64 = (file : File) => {
    //     return new Promise(resolve => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             resolve(reader.result);
    //         }
    //     })
    // }

  return (
    <div>
        <div className="m-4 flex items-center justify-center">
            {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
        </div>
    </div>
  )
}

export default UploadImage