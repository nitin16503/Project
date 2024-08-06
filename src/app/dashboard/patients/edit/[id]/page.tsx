"use client"

import React, { useEffect, ChangeEvent, useState } from 'react'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { getPatientById, editPatientMutation } from '@/src/api/patients';
import './edit.css'
import { AddPatientForm } from '@/src/utils/types';
import { useParams } from 'next/navigation';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Verify from '@/src/components/verify/verify';
import Loader from '@/src/components/loader/loader';

const validationSchema = yup.object().shape({
  phoneNo: yup.string().required('Mobile Number is required').min(10, 'Mobile Number must be of length 10'),
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().test({
    name: 'firstName-lastName-required',
    exclusive: false,
    message: 'First Name and Last Name are required in the username',
    test: function (value: any) {
      // Split the value into words
      // Split the value into words
      const trimmedValue = value?.trim();

      // Split the trimmed value into words
      const words = trimmedValue?.split(' ');

      // Check if there are at least two words (firstname and lastname)
      return words?.length >= 2 && words[words?.length - 1] !== '';
    },
  }),
});

export default function EditPatient() {

  const countryCode = '+91';
  const router = useRouter();
  const { id }: any = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { control, trigger, register, handleSubmit, setError, getValues, setValue, formState: { errors, isValid } } = useForm<AddPatientForm>({
    resolver: yupResolver(validationSchema) as any,
  });
  const {
    isErrorEditPatient,
    errorEditPatient,
    isSuccessEditPatient,
    responseEditPatient,
    statusEditPatient,
    editPatientMutate,
  } = editPatientMutation();
  const {
    patientDetail,
    errorPatientDetail,
    loadingPatientDetail,
    successPatientDetail,
  } = getPatientById(id);

  useEffect(() => {
    if (successPatientDetail) {
      const { statusCode, message, data } = patientDetail?.data || {};
      if (statusCode == 200) {
        const cleanedPhoneNo = data.phoneNo.replace(new RegExp(`^\\+${countryCode}`), '');
        const patientInfo: AddPatientForm = {
          firstName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phoneNo: cleanedPhoneNo
        }
        try {
          Object.keys(patientInfo).forEach((fieldName) => {
            const key = fieldName as keyof AddPatientForm;
            setValue(key, patientInfo[key]);
          });
        } catch (error) {
          console.log("error", error)
        }

      }
    }
    if (errorPatientDetail) {
      console.log(errorPatientDetail, "error")
    }
  }, [successPatientDetail, errorPatientDetail])

  useEffect(() => {
    if (isSuccessEditPatient) {
      const { statusCode, message } = responseEditPatient?.data || {};
      if (statusCode == 200) {
        setIsEdit(true)
      }
    }
    if (isErrorEditPatient) {
      const { statusCode, data, message } = (errorEditPatient as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode == 400) {
        if (Object.keys(data).length > 0) {
          Object.keys(data).map((name) => {
            if (name in validationSchema.fields) {
              setError(name as keyof AddPatientForm, {
                type: name,
                message: data[name],
              });
            }
          })
        } else {
          setError('form', {
            type: 'form',
            message: message,
          });
        }
      }
      else if (statusCode === 401) {
        setError('form', {
          type: 'form',
          message: message,
        });
      }
    }
  }, [isSuccessEditPatient, isErrorEditPatient])

  const validatePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
    .toString()
    .slice(0, 10);
    setValue('phoneNo',e.target.value)
  };

  const onSubmit = (data: AddPatientForm) => {
    const username = data.firstName
    if (username) {
      const [firstName, ...lastNameParts] = username.split(' ');
      const lastName = lastNameParts.join(' ')
      const patientInfo: AddPatientForm = {
        ...data,
        phoneNo: `${countryCode}${data.phoneNo}`,
        firstName: firstName,
        lastName: lastName
      }
      editPatientMutate([id, patientInfo])
    }
  };

  return (
    <>
      {loadingPatientDetail ?
        <Loader />
        :
        !isEdit ?
          <div className="flex flex-col justify-center w-full container">
            <div className="w-full border-b-2">
              <p className="heading">Edit New Patient</p>
            </div>
            <div className="flex-col w-full p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="input" style={{ position: 'relative' }}>
                  <div style={{ color: '#333', fontWeight: 'normal' }} className='defaultNo'>+91</div>
                  <Controller
                    name="phoneNo"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Phone Number"
                        name="phoneNo"
                        placeholder="Enter your mobile number"
                        register={register}
                        type='text'
                        errors={errors}
                        onChange={(e) => {
                          validatePhoneNumber(e)
                        }}
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="input">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Username"
                        name="firstName"
                        placeholder="Enter your username"
                        register={register}
                        type='text'
                        errors={errors}
                        onBlur={() => { }}
                        onChange={(e) => {
                          trigger('firstName');
                        }}
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="input">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Email"
                        name="email"
                        placeholder="Enter your email"
                        register={register}
                        type='text'
                        errors={errors}
                        onBlur={() => { }}
                        onChange={(e) => {
                          trigger('email');
                        }}
                        field={field}
                      />
                    )}
                  />
                </div>
                {errors.form && <p className="formError">{errors?.form?.message}</p>}
                <Button
                  type="submit"
                  label='save'
                  btnStyle={{
                    color: '#fff',
                    backgroundColor: '#0f4a8a',
                    width: "100%",
                    margin: '10px 0px 10px 0px',
                    minWidth: 'unset',
                    marginTop: '25px'
                  }}
                />
              </form>
            </div>
          </div> :
          <Verify
            message="Patient Edited Successfully"
            label="Go to Manage Patients"
            handleClick={() => router.push('/dashboard/patients')}
          />
      }
    </>
  )
}


