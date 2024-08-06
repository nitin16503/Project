import React, { FC, ChangeEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './selectInput.css'

interface SelectInputProps {
    list: any;
    field?: any;
    onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: any;
    isMulti?: boolean;
    label?: string;
    errors: any;
    disabled?: boolean,
    name: string;
}

const SelectInput: FC<SelectInputProps> = ({
    list,
    field,
    disabled = false,
    error,
    isMulti,
    label,
    errors,
    name
}) => {

    return (
        <>
            {label != undefined && <label className="label">{label}</label>}
            <Select
                {...field}
                fullWidth
                value={isMulti ? field.value || [] : field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!error}
                disabled={disabled}
                multiple={isMulti}
                classes={{ select: 'custom-select' }}
                sx={{
                    '.custom-select': {
                        borderRadius: 0, // Set border-radius to 0 for the select input
                        borderWidth: '0px',
                        '&:hover': {
                            backgroundColor: 'transparent !important',
                        },
                    },
                    '&.MuiOutlinedInput-root': {
                        borderRadius: 2.5
                    },
                    '&:hover fieldset': {
                       // border:0
                    },
                }}
            >
                {list.map((obj: any, index: number) => (
                    <MenuItem key={index} value={obj._id}>
                        {obj.name}
                    </MenuItem>
                ))}
            </Select>
            {errors[name] && <p className="error">{errors[name].message}</p>}
        </>
    );
};

export default SelectInput;
