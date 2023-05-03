import React, { FC } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FindValues } from '@/pages/Find';

type InputProps = {
    label: string,
    name: string,
    type: string,
    placeholder?: string,
    register: UseFormRegister<FindValues>,
    errors: FieldErrors<FindValues>;
    icon?: string;
}

// const iconMapping: { [key: string]: IconType } = {
//     beer: FaBeer,
//     user: FaUser,
//     envelope: FaEnvelope,
// };

const TextInput: FC<InputProps> = ({ label, name, type, errors, register, placeholder = `Masukan ${label.toLowerCase()}`, icon }) => {

    // const IconComponent = icon && iconMapping[icon]; 
    // const rules = FormRules[name];

    return (
        <>
            <div className='block'>
                <label htmlFor={name} className='text-black font-semibold text-md'>{label}</label>
                <div className='inline relative'>
                    <input type={type}
                        {...register(name as keyof FindValues)}
                        id={name}
                        placeholder={placeholder} 
                        className='bg-white shadow-sm w-full text-black placeholder-black rounded-md p-1 border-2' />
                    {/* {IconComponent && // only render the icon if it exists in the mapping object
                        <span className='placeholder-icon'>
                            <IconComponent color='black' />
                        </span>
                    } */}
                </div>
                <p className='text-red-500' >{errors[name as keyof FindValues]?.message}</p>
            </div>
        </>
    );
};

export default TextInput;