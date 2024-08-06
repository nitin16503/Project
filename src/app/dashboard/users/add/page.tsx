"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import './adduser.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { ApiResponse } from '@/src/utils/types';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { addUsersMutation } from '@/src/api/dashboard';
import { verifyEmailMutation } from '@/src/api/user';
import Verify from '@/src/components/verify/verify';
import SelectInput from '@/src/components/selectInput/selectInput';
// import { Typography, Button } from "@mui/material";

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNo: yup.string().required('Mobile Number is required').min(10, 'Mobile Number must be of length 10'),
  userLevel: yup.string().required('Role is required'),
});

interface FormData {
  email: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  userLevel: string;
  form?: boolean;
}

export default function AddUser() {

  const userLevelList = [
    {
      "_id": "radiologist",
      "name": "Radiologist"
    },
    {
      "_id": "radiologistFrontDesk",
      "name": "Front Desk"
    },
  ]
  const router = useRouter();
  const [isUserAdded, setUserAdded] = useState(false);
  const { control, trigger, register, handleSubmit, setValue, setError, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const {
    isAddUserError,
    addUserError,
    isAddUserSuccess,
    addUserResponse,
    addUserStatus,
    addUserMutate,
  } = addUsersMutation();
  const {
    isverifyEmailError,
    verifyEmailError,
    isverifyEmailSuccess,
    verifyEmailResponse,
    verifyEmailMutate
  } = verifyEmailMutation()

  useEffect(() => {
    if (isAddUserError) {
      const { statusCode, data, message } = (addUserError as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode == 400) {
        if (data) {
          Object.keys(data).map((name) => {
            if (name in validationSchema.fields) {
              setError(name as keyof FormData, {
                type: name,
                message: data[name],
              });
            }
          })
        }

      }
      else if (statusCode === 401) {
        setError('form', {
          type: 'form',
          message: message,
        });
      }
    }
    else if (isAddUserSuccess) {
      const { statusCode, message } = addUserResponse?.data || {};
      if (statusCode == 200) {
        setUserAdded(true)
      }
    }
  }, [isAddUserError, isAddUserSuccess])

  const validatePhone = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
      .toString()
      .slice(0, 10);
    setValue('phoneNo', e.target.value)
  };



  const onSubmit = (data: FormData) => {
    // Handle form submission logic
    let phoneNumber = getValues('phoneNo')
    phoneNumber = Math.max(0, parseInt(phoneNumber))
      .toString()
      .slice(0, 10).toString();

    if (!phoneNumber.startsWith('+91')) {
      phoneNumber = '+91' + phoneNumber;
    }
    var userLevel = getValues('userLevel');
    if (userLevel == 'FrontDesk') {
      userLevel = 'radiologistFrontDesk'
    }

    const addUserData = {
      ...data,
      userLevel,
      phoneNo: phoneNumber
    }
    try {
      addUserMutate(addUserData);
    } catch (error) {
      console.log(error, 'errors in muta');

    }
  };

  const setFieldError = async (fieldName: keyof FormData, errorMessage: string) => {
    const hasValue = getValues(fieldName);

    if (!hasValue) {
      await trigger(fieldName); // Trigger validation
      setError(fieldName, {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const setEmailError = async () => {
    const val = getValues('email');
    if (val?.length > 0) {
      verifyEmailMutate(val)
    }
    trigger('email')
  };

  useEffect(() => {
    if (isverifyEmailError) {
      const { statusCode, data, message } = (verifyEmailError as any)?.response?.data || {};
      if (statusCode == 400) {
        setError('email', {
          type: 'email',
          message: data.email
        })
      }
    }
    else if (isverifyEmailSuccess) {
      //clearErrors('email');
    }
  }, [isverifyEmailError, isverifyEmailSuccess])

  return (
    <>
      {
        !isUserAdded ? (
          <div className="addUserContainer flex justify-center w-full">
            <div className="heading w-full">
              Add New User
            </div>
            <div className="userForm w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="addUserForm flex ">
                <div className="userRow flex">
                  <div className="row">
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }: any) => (
                        <InputWithLabel
                          label="First Name"
                          placeholder="Enter your first name"
                          register={register}
                          name='firstName'
                          type='text'
                          errors={errors}
                          field={field}
                          onChange={() => trigger('firstName')}
                        />
                      )}
                    />
                  </div>
                  <div className="lastName row">
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }: any) => (
                        <InputWithLabel
                          label="Last Name"
                          placeholder="Enter your last name"
                          register={register}
                          name='lastName'
                          type='text'
                          errors={errors}
                          field={field}
                          onChange={() => trigger('lastName')}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="userRow row">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Email"
                        placeholder="Enter your email"
                        register={register}
                        name='email'
                        type='text'
                        errors={errors}
                        field={field}
                        onBlur={() => setEmailError()}
                        onChange={() => trigger('email')}
                      />
                    )}
                  />
                </div>
                <div className="userRow flex">
                  <div className="row" style={{ position: 'relative' }}>
                    <div style={{ color: '#333', fontWeight: 'normal' }} className='defaultNo'>+91</div>
                    <Controller
                      name="phoneNo"
                      control={control}
                      rules={{ required: 'Mobile Number is required' }}
                      render={({ field }: any) => (
                        <InputWithLabel
                          label="Mobile Number"
                          name="phoneNo"
                          placeholder="Enter your mobile number"
                          register={register}
                          type='number'
                          errors={errors}
                          field={field}
                          onBlur={() => setFieldError('phoneNo', 'Mobile Number is required')}
                          onChange={(e) => {
                            trigger('phoneNo');
                            validatePhone(e); // Additional validation on change
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="dropRoles row">
                    <Controller
                      name="userLevel"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          list={userLevelList}
                          field={field}
                          label="Choose Role"
                          isMulti={false}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors.userLevel}
                          errors={errors}
                          name="userLevel"
                        />
                      )}
                    />
                    {errors.userLevel && <p style={{ color: 'red', marginTop: '4px' }}>{errors.userLevel.message}</p>}
                  </div>
                </div>
                {errors.form && <p className="formError">{errors.form.message}</p>}
                <div className="addUserButton">
                  <Button
                    type="submit"
                    disabled={!isValid || (addUserStatus && addUserStatus ? true : false)}
                    label='Add User'
                    btnStyle={{
                      color: '#fff',
                      backgroundColor: '#0f4a8a',
                      width: "100%"
                    }}
                  />
                </div>
                {/* <div className="input" style={{
                  display: 'flex',

                }}>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={!isValid || (addUserStatus && addUserStatus ? true : false)}
                    fullWidth
                    sx={{
                      margin: '10px 0px 20px 20px',
                      minWidth: 'unset',
                      p: 1,
                      borderRadius: 1,
                      background: '#0F4A8A'
                    }}>Save</Button>
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={() => router.back()}
                    sx={{
                      margin: '10px 0px 20px 20px',
                      minWidth: 'unset',
                      p: 1,
                      borderRadius: 1,
                    }}>Cancel</Button>
                </div> */}
              </form>
            </div>
          </div>
        ) : <Verify
          message="New user created"
          label="Go to Manage Users"
          handleClick={() => router.push('/dashboard/users')}
        />
      }
    </>
  );
}
