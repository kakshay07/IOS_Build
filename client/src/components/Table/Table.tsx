import React, { useEffect, useState } from "react"
import './Table.css'
    interface TableProps {
        children:any;
        className?: string;
        width?: number | string;
        pagination ? : boolean;
    }

    const useTable = (refresh: (page: number) => void) => {
        const [page, setPage] = useState(0);

        useEffect(() => {
            if (page >= 0) {
            refresh(page);
            } else {
            setPage(0);
            }
            
        }, [page]);

        const Table : React.FC<TableProps> = ({ children, className , pagination }) => {
            return (
                <div className={`TableComp shadow rounded-lg border border-gray-200 mx-3 mb-2 ${className}`}>
                    <div className="overflow-x-auto lg:overflow-x-none rounded-t-lg tableOverflowContainer">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            {children}
                        </table>
                    </div>
                    {
                        pagination && 
                        <div className="rounded-b-lg border-t border-gray-200 px-4 py-2 ">
                            <ol className="flex justify-end gap-1 text-xs font-medium">
                            <li>
                                <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage((curr) => {
                                    return  Math.max(0, curr - 1)
                                });
                                }}
                                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                                >
                                <span className="sr-only">Prev Page</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                    />
                                </svg>
                                </a>
                            </li>

                            <li>
                                <a
                                href="#"
                                className="block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
                                >
                                {page + 1}
                                </a>
                            </li>

                            <li>
                                <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage((curr) => {
                                    return  ++curr
                                });
                                }}
                                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                                >
                                <span className="sr-only">Next Page</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                    />
                                </svg>
                                </a>
                            </li>
                            </ol>
                        </div>
                    }
                    
                </div>
            );
        };
        
        // const Thead : React.FC<TableProps> = ({ children, className }) => {
        //     return (
        //     <thead className={` ltr:text-left rtl:text-right bg-gray-100 ${className}`}>
        //         {children}
        //     </thead>
        //     );
        // };

        // const Tbody : React.FC<TableProps> = ({ children, className }) => {
        //     return (
        //     <thead className={`divide-y divide-gray-200 ${className}`}>
        //         {children}
        //     </thead>
        //     );
        // };

        // const Td : React.FC<TableProps> = ({ children, className , width}) => {
        //     return (
        //     <td width={width} className={`whitespace-nowrap px-4 py-2 font-medium ${className}`}>
        //         {children}
        //     </td>
        //     );
        // };

        // const Th : React.FC<TableProps> = ({ children, className }) => {
        //     return (
        //         <th className={`font-semibold text-left whitespace-nowrap px-4 py-2 font-medium text-gray-900 ${className}`}>
        //             {children}
        //         </th>
        //     );
        // };

        // const Tr : React.FC<TableProps> = ({ children, className }) => {
        //     return (
        //         <tr className={` ${className}`}>
        //             {children}
        //         </tr>
        //     );
        // };

        return {Table , page , setPage}
    }

    export default useTable;