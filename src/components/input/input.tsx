// InputWithLabel.tsx
import React, { FC, ChangeEvent } from 'react';

import './input.css';

interface InputWithLabelProps {
  name: string;
  label: string;
  disabled?: boolean;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  register: any;
  errors: any;
  defaultValue?: string | number;
  field?:any;
  onFocus?:(e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?:(e: ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel: FC<InputWithLabelProps> = ({
  name,
  onChange,
  width,
  label,
  type = 'text',
  defaultValue,
  placeholder = '',
  register,
  errors,
  disabled = false,
  field,
  onFocus,
  onBlur
}) => {

  const inputFieldClass = (name === 'phoneNumber' || name === 'phoneNo') ? 'inputField phoneNumberField' : 'inputField';
  return (
    <div className="inputContainer flex flex-col justify-start" style={{ width: width ? width : '' }}>
      {label!=undefined &&<label className="label">{label}</label>}
      {
        name === 'description' ? (
          <textarea
          type={type}
          {...register(name, {
            onChange: (e:  ChangeEvent<HTMLInputElement>) => {
              if(onChange){
                onChange(e)
              }
              // Add any other necessary logic here
            },
          })}
          placeholder={placeholder}
          className={inputFieldClass}
          disabled={disabled}
          defaultValue={defaultValue}
          style={{color: disabled ? 'grey' : 'black'}}
          {...field}
          onFocus={onFocus}
          onBlur={onBlur} 
          value={field?.value || ''}
        />
        ) :
        (
          <input
          type={type}
          {...register(name, {
            onChange: (e:  ChangeEvent<HTMLInputElement>) => {
              if(onChange){
                onChange(e)
              }
              // Add any other necessary logic here
            },
          })}
          placeholder={placeholder}
          className={inputFieldClass}
          disabled={disabled}
          defaultValue={defaultValue}
          style={{color: disabled ? 'grey' : 'black'}}
          {...field}
          onFocus={onFocus}
          onBlur={onBlur} 
          value={field?.value || ''}
        />
        )
      }
      {errors[name] && <p className="error" style={{textAlign: 'start'}}>{errors[name].message}</p>}
    </div>
  );
};

export default InputWithLabel;
