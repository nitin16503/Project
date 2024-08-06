// ChangePassword.tsx
import React, { useEffect, useState } from 'react';
import './changePassword.css'; // Make sure to create/change the corresponding CSS file
import InputWithLabel from '../input/input';
import Button from '../button/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { changePasswordMutation } from '@/src/api/user';
import Verify from '../verify/verify';

interface FormData {
  password: string;
  confirmPassword: string;
  form?: boolean
}

const ChangePassword = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerify, setIsVerify] = useState(false);
  const email = searchParams?.get('email')
  const code = searchParams?.get('code');
  const fieldNames = ['password', 'confirmPassword'];
  const validationSchema = yup.object().shape({
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one digit, and one special character'
      )
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { handleChangePasswordError,
    changePasswordError,
    handleChangePasswordSuccess,
    changePasswordResponse,
    handlechangePasswordStatus,
    changePasswordMutate } = changePasswordMutation();

  useEffect(() => {
    if (handleChangePasswordSuccess) {
      const { statusCode, data } = changePasswordResponse?.data || {};
      if (statusCode === 200) {
        setIsVerify(true)
      }
    }
  }, [handleChangePasswordSuccess]);

  useEffect(() => {
    if (handleChangePasswordError) {
      const { statusCode, message } = (changePasswordError as AxiosError<ApiResponse>)?.response?.data ?? {};
      if (statusCode === 401) {
        setError('form', {
          type: 'form',
          message: message,
        });
      }
    }
  }, [handleChangePasswordError]);

  const onSubmit = (data: FormData) => {
    const postData: any = {
      ...data,
      code,
      email
    };
    changePasswordMutate(postData);
  };

  const hasFieldError = () => {
    const res = fieldNames.some((fieldName) => (errors as any)[fieldName]);
    return res;
  };

  return (
    !isVerify ? (
      <div className="changePassword flex flex-col">
        <div className="changePasswordContainer flex flex-col items-center justify-center w-full">
          <div className="w-full title items-start flex flex-col">
            Update Password
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="form flex flex-col w-full">
              <div className="flex flex-col" style={{ rowGap: '20px' }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'New Password is required' }}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="New Password"
                      placeholder="Enter your new password"
                      register={register}
                      name='password'
                      type='password'
                      errors={errors}
                      field={field}
                      onChange={() => trigger('password')}
                    />
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: 'Confirm Password is required',
                  }}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Confirm Password"
                      placeholder="Confirm your new password"
                      register={register}
                      name='confirmPassword'
                      type='password'
                      errors={errors}
                      field={field}
                      onChange={() => trigger('confirmPassword')}
                    />
                  )}
                />
              </div>
              <div className="passwordNote">
                *Your password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, , &, ?).
              </div>
              {!hasFieldError() && errors.form && <p className="formError">{errors.form.message}</p>}
              <div className="loginButton">
                <Button
                  type="submit"
                  label="Update Password"
                  disabled={!isValid || (handlechangePasswordStatus && handlechangePasswordStatus ? true : false)}
                  btnStyle={{
                    color: '#fff',
                    backgroundColor: '#f0a400',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    ) :
      (
        <Verify
          message="Password Updated Successfully"
          label="Go to Login"
          handleClick={() => router.push('/login')}
        />
      )
  );

};

export default ChangePassword;
