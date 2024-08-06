"use client"
import React, { ChangeEvent, useEffect, useState } from 'react';
import './editUser.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { editUserMutation, getUserMutation } from '@/src/api/dashboard';
import Verify from '@/src/components/verify/verify';
import { useParams } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import Loader from '@/src/components/loader/loader';
import SelectInput from '@/src/components/selectInput/selectInput';

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

export default function EditUser() {

  const countryCode = '+91';
  const router = useRouter();
  const queryClient = new QueryClient();
  const [userData, setUserData] = useState<any>({});
  const { id }: any = useParams<{ id: string }>();
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
  const [isUserAdded, setUserAdded] = useState(false);
  const { control, trigger, register, handleSubmit, setValue, setError, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema)
  });
  const [isDataAvailable, setDataAvailable] = useState(false);
  const {
    isAddUserError,
    addUserError,
    isAddUserSuccess,
    addUserResponse,
    editUserStatus,
    editUserMutate,
  } = editUserMutation();
  const {
    isGetUserError,
    getUserError,
    isGetUserSuccess,
    getUserResponse,
    getUserStatus,
    getUserMutate,
  } = getUserMutation()

  useEffect(() => {
    setValue('email', userData?.email || '');
    setValue('phoneNo', userData?.phoneNo || '');
    setValue('firstName', userData?.firstName || '');
    setValue('lastName', userData?.lastName || '');
    setValue('userLevel', userData?.userLevel || ''); // Set dropdown value here
  }, [userData]);

  useEffect(() => {
    if (isGetUserError) {
      const { statusCode, message, data } = (getUserError as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode === 400) {
        console.log(data, 'error');
      }
    } else if (isGetUserSuccess) {
      const { statusCode, data } = getUserResponse?.data || {};
      if (statusCode === 200) {
        const phoneNo = data?.phoneNo;
        const cleanedPhoneNo = phoneNo ? phoneNo.replace(new RegExp(`^\\+${countryCode}`), '') : '';
        setDataAvailable(true)
        setUserData({ ...data, phoneNo: cleanedPhoneNo });
      }
    }
  }, [isGetUserError, isGetUserSuccess]);

  useEffect(() => {
    if (id) {
      getUserMutate(id.toString());
    }
  }, [id]);

  useEffect(() => {
    if (isAddUserError) {
      const { statusCode, data, message } = (addUserError as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode == 400) {
        if (data) {
          Object.keys(data).map((name) => {
            console.log('outside', name, FormData);

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
        //queryClient.invalidateQueries({ queryKey: ['userList', 1] });
      }
    }
  }, [isAddUserError, isAddUserSuccess])

  const validatePhone = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
    .toString()
    .slice(0, 10);
    setValue('phoneNo',e.target.value)
  };

  const onSubmit = (data: FormData) => {
    // Handle form submission logic
    let phoneNumber = getValues('phoneNo').toString();
    if (!phoneNumber.startsWith(countryCode)) {
      phoneNumber = `${countryCode}${phoneNumber}`;
    }
    const addUserData = {
      ...data,
      phoneNo: phoneNumber,
      id: userData?.id
    }
    try {
      editUserMutate(addUserData);
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

  return (
    <>
      {
        !getUserStatus ? (
          !isUserAdded ? (
            <div className="addUserContainer flex justify-center w-full">
              {
                isDataAvailable ? (
                  <>
                    <div className="heading w-full">Edit User</div>
                    <div className="userForm w-full">
                      <form onSubmit={handleSubmit(onSubmit)} className="addUserForm flex ">
                        <div className="userRow flex">
                          <div className="row">
                            <Controller
                              name="firstName"
                              control={control}
                              rules={{ required: 'First Name is required' }}
                              render={({ field }: any) => (
                                <InputWithLabel
                                  label="First Name"
                                  placeholder="Enter your first name"
                                  register={register}
                                  name='firstName'
                                  type='text'
                                  errors={errors}
                                  field={field}
                                  onBlur={() => setFieldError('firstName', 'First Name is required')}
                                  onChange={() => trigger('firstName')}
                                />
                              )}
                            />
                          </div>
                          <div className="lastName row">
                            <Controller
                              name="lastName"
                              control={control}
                              rules={{ required: 'Last Name is required' }}
                              render={({ field }: any) => (
                                <InputWithLabel
                                  label="Last Name"
                                  placeholder="Enter your last name"
                                  register={register}
                                  name='lastName'
                                  type='text'
                                  errors={errors}
                                  field={field}
                                  onBlur={() => setFieldError('lastName', 'Last Name is required')}
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
                            rules={{ required: 'Email is required' }}
                            render={({ field }: any) => (
                              <InputWithLabel
                                label="Email"
                                placeholder="Enter your email"
                                register={register}
                                name='email'
                                type='text'
                                errors={errors}
                                field={field}
                                onBlur={() => setFieldError('email', 'Email is required')}
                                onChange={() => trigger('email')}
                              />
                            )}
                          />
                        </div>
                        <div className="userRow flex">
                          <div className="row" style={{ position: 'relative' }}>
                            <div style={{ color: '#333', fontWeight: 'normal' }} className='defaultNo'>{countryCode}</div>
                            <Controller
                              name="phoneNo"
                              control={control}
                              rules={{ required: 'Phone Number is required' }}
                              render={({ field }: any) => (
                                <InputWithLabel
                                  label="Phone Number"
                                  name="phoneNo"
                                  placeholder="Enter your phone number"
                                  register={register}
                                  type='number'
                                  field={field}
                                  errors={errors}
                                  onBlur={() => setFieldError('phoneNo', 'Phone Number is required')}
                                  onChange={(e) => {
                                    trigger('phoneNo');
                                    validatePhone(e); // Additional validation on change
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div className="dropRoles row">
                            {/* <FormControl fullWidth variant="outlined"> */}
                            <Controller
                              name="userLevel"
                              control={control}
                              defaultValue={userData?.userLevel || ''}  // Set default value here
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
                            {errors.userLevel && <p style={{ color: 'red', marginTop: 'px' }}>{errors.userLevel.message}</p>}
                            {/* </FormControl> */}
                          </div>
                        </div>
                        {errors.form && <p className="formError">{errors.form.message}</p>}
                        <div className="addUserButton">
                          <Button
                            type="submit"
                            disabled={!isValid || (editUserStatus && editUserStatus ? true : false)}
                            label='Save'
                            btnStyle={{
                              color: '#fff',
                              backgroundColor: '#0f4a8a',
                              width: "100%"
                            }}
                          />
                        </div>
                      </form>
                    </div>
                  </>
                ) : isGetUserError ? (
                  <div className="userError flex h-full justify-center items-center">
                    <div className="errorTittle mb-3 ">
                      Error
                    </div>
                    <div className="errorMessege">
                      Can't find User
                    </div>
                  </div>
                ) : null
              }
            </div>
          ) : <Verify
            message="User Edited Successfully"
            label="Go to Manage Users"
            handleClick={() => router.push('/dashboard/users')}
          />
        ) : <Loader />
      }
    </>
  );
}
