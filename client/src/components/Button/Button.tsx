import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export const ActionButtonGroup = ({
    onView ,
    onEdit ,
    onDelete,
    onDuplicate,
    onAddPayment,
    onFileView,
    view,
    edit,
    deletee,
    duplicate,
    AddPayment,
    viewFile
}:{
    onView ?: () => void,
    onEdit ?: () => void,
    onDelete ?: () => void,
    onDuplicate ?: () => void,
    onAddPayment ?: () => void,
    onFileView ?: () => void,
    view ?: boolean,
    edit ?: boolean,
    deletee ?: boolean,
    duplicate ?: boolean,
    AddPayment ?: boolean,
    viewFile ?:boolean
}) => {
    const { pageAccess} = useAuth();
    const location = useLocation();
    // const [active,setActive]=useState(false);

    // useEffect(() => {
    //    const acessObj = pageAccess.filter(_ => (_.url == location.pathname))[0]
    //     if(acessObj && (acessObj.access_to_delete==1 || acessObj.access_to_update==1)){
    //         setActive(true)
    //     }else {
    //         setActive(false)
    //     }
    // }, [])
    // const accessObj = pageAccess.find(_ => _.url === location.pathname) ;
    // const [state, setState] = useState({
    //     active: false,
    //     EditActive: false,
    //     DeleteActive: false,
    //     AddPayment: false,
    //   });
      const accessObj = pageAccess.find((obj) => obj.url == location.pathname);
      // useEffect(() => {
      //   const accessObj = pageAccess.find((obj) => obj.url === location.pathname);
      //   const newState = {
      //     active: accessObj?.access_to_update === 1 || accessObj?.access_to_delete === 1,
      //     EditActive: accessObj?.access_to_update === 1,
      //     DeleteActive: accessObj?.access_to_delete === 1,
      //     AddPayment: accessObj?.access_to_update ===1,
      //   };
      // setState(newState)
      //   setState((prevState) => {
      //     if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
      //       return newState;
      //     }
      //     return prevState;
      //   });
      // }, [pageAccess, location.pathname]);
    return (
      <>
        <span className=" mt-auto inline-flex overflow-hidden bg-white border rounded-md shadow-sm ">
          {view && (
            <button
              type="button"
              onClick={() => {
                onView && onView();
              }}
              className="inline-block px-2 py-2 text-gray-700 border-e hover:bg-gray-50 focus:relative"
              title="View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
          {edit && (
            <button
              type="button"
              title="Edit"
              disabled={!accessObj?.access_to_update}
              onClick={() => {
                // if (state.EditActive) onEdit && onEdit();
                if (accessObj?.access_to_update) onEdit && onEdit(); //ANOTHER METHOD

              }}
              className={`inline-block border-e py-2 px-2 focus:relative ${
                accessObj?.access_to_update
                  ? "text-cyan-700 hover:bg-gray-50"
                  : "bg-gray-300 text-gray-400 border-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          )}
          {AddPayment && (
            <button
              type="button"
              title="AddPayment"
              disabled={!accessObj?.access_to_update}
              onClick={() => {
                // if (state.EditActive) onAddPayment && onAddPayment();
                onAddPayment && onAddPayment();
              }}
              className={`inline-block border-e py-3 px-3 focus:relative ${
                accessObj?.access_to_update
                  ? "text-cyan-700 hover:bg-gray-50"
                  : "bg-gray-300 text-gray-400 border-gray-300"
              }`}
            >
              <svg
                fill="none"
                className="w-4 h-4"
                version="1.1"
                id="XMLID_19_"
                stroke="black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g id="payment-paypal">
                  <path
                    d="M17.9,2.6c-1-1.1-2.7-1.6-5-1.6H6.3C5.8,1,5.4,1.3,5.4,1.8L2.6,19c-0.1,0.3,0.2,0.7,0.6,0.7h4.1l1-6.3l0,0
                    c0.1-0.5,0.5-0.8,0.9-0.8h1.9c3.8,0,6.7-1.5,7.6-6c0-0.1,0.1-0.3,0.1-0.4C19,4.7,18.8,3.6,17.9,2.6 M19.7,7.2L19.7,7.2
                    c0,0.1-0.1,0.2-0.1,0.4c-0.9,4.4-3.8,6-7.6,6h-1.9c-0.5,0-0.8,0.3-0.9,0.8l-1,6.3l-0.3,1.8c0,0.3,0.2,0.6,0.5,0.6h3.4
                    c0.4,0,0.7-0.3,0.8-0.7v-0.2l0.6-4.1v-0.2c0.1-0.4,0.4-0.7,0.8-0.7h0.6c3.3,0,5.9-1.3,6.7-5.2c0.3-1.6,0.2-3-0.7-3.9
                    C20.3,7.7,20,7.4,19.7,7.2"
                  />
                </g>
              </svg>
            </button>
          )}

          {deletee && (
            <button
              type="button"
              disabled={!accessObj?.access_to_delete}
              onClick={() => {
                // if (state.DeleteActive) onDelete && onDelete();
                if (accessObj?.access_to_delete) onDelete && onDelete();
              }}
              // className="inline-block p-3 text-red-700 hover:bg-gray-50 focus:relative disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300"
              title="Delete"
              className={`inline-block p-2 focus:relative ${
                accessObj?.access_to_delete
                  ? "text-red-700 hover:bg-gray-50"
                  : "bg-gray-300 text-gray-400 border-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          )}

          {duplicate && (
            <button
              type="button"
              onClick={() => {
                onDuplicate && onDuplicate();
              }}
              className="inline-block p-2 text-red-700 hover:bg-gray-50 focus:relative"
              title="Duplicate"
            >
              <svg
                style={{ opacity: ".7" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                id="IconChangeColor"
                height="20"
                width="20"
              >
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                  points="168 168 216 168 216 40 88 40 88 88"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="12"
                ></polyline>
                <rect
                  x="40"
                  y="88"
                  width="128"
                  height="128"
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="12"
                ></rect>
              </svg>
            </button>
          )}
          {viewFile && (
            <button
              type="button"
              title="View File"
              onClick={() => {
                onFileView && onFileView();
              }}
              className={`inline-block border-e py-2 px-2 focus:relative text-cyan-700 hover:bg-gray-50`}
            >
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
                  fill="#000000"
                />
              </svg>
            </button>
          )}
        </span>
      </>
    );
};

export const AddButton = ({
    children,
    onClick,
    varient
}: {
    children: string;
    onClick?: () => void;
    varient?: 'blue' | 'light' | 'red' | 'green';
}) => {
    const { pageAccess} = useAuth();
    const location = useLocation();
    const [active,setActive]=useState(()=>{
        const acessObj=pageAccess.find(_=>_.url==location.pathname);
        return acessObj && (acessObj.access_to_add==1)
    });
    useEffect(() => {
       const acessObj = pageAccess.filter(_ => (_.url == location.pathname))[0]
        if(acessObj && acessObj.access_to_add && acessObj.access_to_add == 1){
            setActive(true);
        }else {
            setActive(false);
        }
    }, [pageAccess,location.pathname])
    
    return (
      <>
        <button
          disabled={!active}
          onClick={onClick}
          className={`${
            varient === "green"
              ? `inline-flex items-center gap-2 rounded border border-green-900 bg-green-900 px-6 py-3 text-white hover:bg-transparent hover:text-green-900 focus:outline-none focus:ring active:text-green-500 mx-2 my-3 disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300`
              : `inline-flex items-center gap-2 rounded border border-indigo-900 bg-indigo-900 px-6 py-3 text-white hover:bg-transparent hover:text-indigo-900 focus:outline-none focus:ring active:text-indigo-500 mx-2 my-3 disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300`
          }
    `}
        >
          <span className="text-sm font-medium">{children}</span>
          <i className="fa-solid fa-plus"></i>
        </button>
      </>
    );
};

export const FilterButton = ({
    onClick,
}: {
    onClick?: () => void;
}) => {
    return (
        <>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 text-white bg-indigo-700 border border-indigo-700 rounded hover:bg-transparent hover:text-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
            >
                <span className="text-sm font-medium">Filter</span>
                <i className="fa-solid fa-filter"></i>
            </button>
        </>
    );
};

export const FilterResetButton = ({
    onClick,
    type
}: {
    onClick?: () => void;
    type ?: "button" | "submit" | "reset" | undefined;
}) => {
    return (
        <>
            <button
                onClick={onClick}
                type = {type}
                className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 text-white bg-gray-700 border border-gray-700 rounded hover:bg-transparent hover:text-gray-700 focus:outline-none focus:ring active:text-indigo-500"
            >
                <span className="text-sm font-medium">Reset</span>
                <i className="fa-solid fa-filter-circle-xmark"></i>
            </button>
        </>
    );
};

export const UploadExcell = ({ onClick }: { onClick?: () => void }) => {
    return (
        <>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500"
            >
                <span className="text-sm font-medium"> Upload Excell </span>
                <i className="fa-solid fa-file-csv"></i>
            </button>
        </>
    );
};

// export const ExportExcell = ({filename , urlPath}:{filename : string; urlPath : string;}) => {
//     return (
//         <>
//             <button
//                 onClick={async ()=>{
//                     const data = await axios.get('http://localhost:5000' + urlPath);
//                     downloadCSV(data.data , filename);
//                   }}
//                 className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 text-blue-700 border border-blue-700 rounded hover:bg-blue-700 hover:text-white focus:outline-none focus:ring active:bg-blue-700"
//             >
//                 <span className="text-sm font-medium"> Export Excell </span>
//                 <i className="fa-solid fa-file-csv"></i>
//             </button>
//         </>
//     );
// };

export const ExportExcell = ({ onClick }: {onClick?: () => void;}) => {
  const { pageAccess} = useAuth();
  const location = useLocation();
  const accessObj = pageAccess.find((obj) => obj.url == location.pathname);

  return (
      <>
          <button
              disabled={!accessObj?.access_to_export}
              onClick={()=>{ if (accessObj?.access_to_export) onClick && onClick()}}
              // className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3  text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white focus:outline-none focus:ring active:bg-green-700"
              className={`inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 ${
                accessObj?.access_to_export
                  ? "text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white focus:outline-none focus:ring active:bg-green-700"
                  : "bg-gray-300 text-gray-400 border-gray-300 rounded"
              }`}
          >
              <span className="text-sm font-medium"> Export Excell </span>
              <i className="fa-solid fa-file-csv"></i>
          </button>
      </>
  );
};

export const PrintPDF = ({ onClick }: {onClick?: () => void;}) => {
  const { pageAccess} = useAuth();
  const location = useLocation();
  const accessObj = pageAccess.find((obj) => obj.url == location.pathname);

  return (
      <>
          <button
              disabled={!accessObj?.access_to_export}
              onClick={()=>{ if (accessObj?.access_to_export) onClick && onClick()}}
              className={`inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 ${
                accessObj?.access_to_export
                  ? "text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white focus:outline-none focus:ring active:bg-red-500"
                  : "bg-gray-300 text-gray-400 border-gray-300 rounded"
              }`}
          >
              <span className="text-sm font-medium"> Download PDF </span>
              <i className="fa-solid fa-print"></i>
          </button>
      </>
  );
};

export const DownloadExcell = ({ link }: { link : string }) => {
    return (
        <>
            <a  
                href={link}
                download = 'asdas'
                className="inline-flex items-center gap-2 px-6 py-3 mx-2 my-3 text-blue-700 border border-blue-700 rounded cursor-pointer hover:bg-blue-700 hover:text-white focus:outline-none focus:ring active:bg-blue-700"
            >
                <span className="text-sm font-medium">Download Template</span>
                <i className="fa-solid fa-download"></i>
            </a>
        </>
    );
};


export const ToggleFilterButton = ({
  onClick,
  desc
}: {
  onClick?: () => void;
  desc: boolean
}) => {
  return (
      <>
          <button
              onClick={onClick}
              className="inline-flex items-center gap-2 px-5 py-3 mx-2 my-3 text-indigo-700 border border-indigo-700 rounded hover:bg-transparent hover:bg-indigo-700 hover:text-indigo focus:outline-none focus:ring active:text-indigo-500"
          >
              <span className="text-sm font-medium">{desc?'Hide':'Show'} Filters</span>
              {desc ? <i className="fa-solid fa-chevron-up"></i>:<i className="fa-solid fa-chevron-down"></i>}
              
          </button>
      </>
  );
};


const Button = ({
    children,
    varient,
    loading,
    onClick,
    type,
    disabled,
    styleClass
}: {
    children: React.ReactNode;
    varient: 'blue' | 'light' | 'red' | 'green';
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined;
    disabled? : boolean;
    styleClass?: string;
}) => {
    return (
        <button 
                type = {type}
                disabled = {loading || disabled}
                onClick={onClick}
                className={
                    varient === 'blue' ? 
                    `inline-block w-fulll rounded  px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-blue-500 hover:bg-blue-600 hover:text-white disabled:bg-blue-400  mx-2 my-3 ${styleClass}`
                    : varient === 'light' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-gray-500  bg-gray-200 hover:bg-gray-300 hover:text-gray-500 sm:w-auto disabled:text-gray-400 disabled:hover:bg-gray-200 mx-2 my-3 ${styleClass}`
                    : varient === 'red' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-red-800  bg-red-400 hover:bg-red-500 hover:text-red-800 sm:w-auto disabled:text-red-500 disabled:hover:bg-red-400 mx-2 my-3 ${styleClass}`
                    : varient =='green' ?
                    `inline-block w-fulll rounded px-5 py-3 text-center text-sm font-semibold text-white  bg-green-700 hover:bg-green-800 hover:text-white-800 sm:w-auto disabled:bg-gray-300 mx-2 my-3 ${styleClass}` 
                     :''
                }
            >
                <div className="flex">
                    {
                        loading && 
                        <svg
                            className={`animate-spin -ml-1 mr-3 h-5 w-5 
                            ${varient === 'blue' ? 'text-white' 
                            : varient === 'light' ? 'text-gray'
                            : varient === 'red' ? 'text-white' : 'text-white'} `}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    }
                    {children}
                </div>
            </button>
    )
    
    
};

export default Button;
