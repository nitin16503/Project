import React, { FC , ChangeEvent } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input'
import Box from '@mui/material/Box';
import { FormHelperText } from '@mui/material';

interface OTPProps {
    name:string;
    field?:any;
    errors: any;
    register: any;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const OTP: FC<OTPProps> = ({
    name,
    field,
    errors,
    onChange,
    register
}) => {

    return (
        <Box>
            <MuiOtpInput
                name={name}
                sx={{ 
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderRadius:0,
                          borderTopColor:'transparent',
                          borderLeftColor:'transparent',
                          borderRightColor:'transparent',
                        },
                        '&:hover fieldset': {
                            borderRadius:0,
                            borderTopColor:'transparent',
                            borderLeftColor:'transparent',
                            borderRightColor:'transparent',
                        },
                        '&.Mui-focused fieldset': {
                            borderRadius:0,
                            borderTopColor:'transparent',
                            borderLeftColor:'transparent',
                            borderRightColor:'transparent',
                        },
                      },
                }}
                {...register(name, {
                    onChange: (e:  ChangeEvent<HTMLInputElement>) => {
                      if(onChange){
                        onChange(e)
                      }
                      // Add any other necessary logic here
                    },
                })}
                {...field}
                value={field?.value}
                length={5}
                autoFocus
                validateChar={(character: string, index: number) => /\d/.test(character)} // Only allow numeric characters
            />
            {errors[name] ? (
                <FormHelperText error className='formError'>{errors[name].message}</FormHelperText>
            ) : null}
        </Box>
    );
};

export default OTP;
