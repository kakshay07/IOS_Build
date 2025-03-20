import React, { ChangeEvent } from 'react';
import './Select.css'
import { UseFormRegisterReturn } from 'react-hook-form';


interface DropdownProps {
    value?: string;
    placeholder?: string;
    styleClass?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    children: React.ReactNode ;
    label ?: string;
    name?: string;
    disabled ?: boolean;
    error?: boolean;
    errorMessage?: string;
    register?: UseFormRegisterReturn;

}

const SelectField: React.FC<DropdownProps> = ({
    value = '',
    styleClass = '',
    onChange,
    required,
    children,
    label,
    name ,
    disabled,
    error,
    errorMessage,
    register
}) => {
    // const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    //     const { value } = event.target;
    //     onChange(value);
    // };

    return (
        <div className={`select-field ${error && 'error'} flex flex-col justify-end flex-wrap mx-2 mt-2 ${styleClass}`}>
            {label && <label className='w-full' htmlFor={name}>{label}{required && <span style={{color:'red'}}>*</span>}</label>}
            <select
                value={register ? undefined : value}
                className="h-12 w-full rounded border border-gray-400 px-4 py-3 pe-12 text-sm shadow-sm"
                onChange={register ? undefined : onChange}
                required = {required}
                name={name}
                disabled = {disabled}
                id={name}
                {...register}
            >
                {children}
            </select>
            <span className='text-[10px] text-red-400 min-h-[15px] ml-1'>{error ? errorMessage : ''}</span>
        </div>
    );
};

export default SelectField;
