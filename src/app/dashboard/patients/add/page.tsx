"use client"

import React, { useState, useEffect, ChangeEvent } from 'react'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import { useSearchParams } from "next/navigation";
import { getPatientByNumber, addPatientMutation, getScanTests, addScanMutation } from '@/src/api/patients';
import './add.css'
import { AddPatientForm } from '@/src/utils/types';
import Upload from '@/src/components/upload/upload';
import SelectInput from '@/src/components/selectInput/selectInput';
import { ApiResponse, FieldError } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Loader from '@/src/components/loader/loader';
import CustomModal from '@/src/components/modal/modal';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Verify from '@/src/components/verify/verify';
import { Typography, Button } from "@mui/material";

const validationSchema = yup.object().shape({
  phoneNo: yup.string().required('Mobile Number is required').min(10, 'Mobile Number must be of length 10'),
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().test({
    name: 'firstName-lastName-required',
    exclusive: false,
    message: 'First Name and Last Name are required in the username',
    test: function (value: any) {
      // Split the value into words
      const trimmedValue = value?.trim();

      // Split the trimmed value into words
      const words = trimmedValue?.split(' ');

      // Check if there are at least two words (firstname and lastname)
      return words?.length >= 2 && words[words?.length - 1] !== '';
    },
  }),
  testPrice: yup.string().required('Billing amount is required'),
  test: yup.string().required('Select test'),
  priority: yup.string().required('Select Priority'),
  file: yup.string(),
});

export default function AddPatient() {

  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("number");
  const countryCode = '+91';
  const priorityEnum = [
    {
      "_id": "LOW",
      "name": "LOW"
    },
    {
      "_id": "MEDIUM",
      "name": "MEDIUM"
    },
    {
      "_id": "HIGH",
      "name": "HIGH"
    },
  ]
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanList, setScanList] = useState<[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [patientFound, setPatientFound] = useState(false);
  const [existingPatientId, setExistingPatientId] = useState('');
  const [modifyFlag, setModifyFlag] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [conflictAction, setConflictAction] = useState('');
  const { control, trigger, register, handleSubmit, setError, getValues, setValue, reset, formState: { errors, isValid } } = useForm<AddPatientForm>({
    resolver: yupResolver(validationSchema) as any,
  });
  const {
    scanlist,
    errorScanList,
    loadingScanList,
    successScanList
  } = getScanTests();
  const {
    isErrorAddPatient,
    errorAddPatient,
    isSuccessAddPatient,
    responseAddPatient,
    statusAddPatient,
    addPatientMutate,
  } = addPatientMutation();
  const {
    patientDetail,
    errorPatientDetail,
    loadingPatientDetail,
    successPatientDetail,
    isErrorPatientDetail,
    getPatient
  } = getPatientByNumber(phoneNumber);
  const {
    isErrorAddScan,
    errorAddScan,
    isSuccessAddScan,
    responseAddScan,
    statusAddScan,
    addScanMutate
  } = addScanMutation();

  useEffect(() => {
    if (searchQuery != null) {
      setPhoneNumber(encodeURIComponent(searchQuery))
    }
  }, [searchQuery]);

  useEffect(() => {
    if (successScanList) {
      const { statusCode, message, data } = scanlist?.data || {};
      if (statusCode == 200) {
        if (data != null) {
          setScanList(data)
          if (data.length === 1) {
            setValue('test', data[0]._id)
          }
        }
      }
    }
  }, [successScanList])

  useEffect(() => {
    if (successPatientDetail) {
      const { statusCode, message, data } = patientDetail?.data || {};
      if (statusCode == 200) {
        setExistingPatientId(data.id)
        const cleanedPhoneNo = data.phoneNo.replace(new RegExp(`^\\+${countryCode}`), '');
        const patientInfo: AddPatientForm = {
          firstName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phoneNo: cleanedPhoneNo
        }
        Object.keys(patientInfo).forEach((fieldName) => {
          const key = fieldName as keyof AddPatientForm;
          setValue(key, patientInfo[key]);
          setError(key, {
            type: key,
            message: '',
          });
        });
        setPatientFound(true)
        setModifyFlag(true)
      }
    }
    if (isErrorPatientDetail) {
      const { statusCode, data, message } = (errorPatientDetail as AxiosError<ApiResponse>)?.response?.data || {};
      setExistingPatientId('')
      if (statusCode == 404) {
        setValue('email', '');
        setValue('firstName', '');
        setPatientFound(false)
      }
    }
  }, [successPatientDetail, isErrorPatientDetail])

  useEffect(() => {
    if (scroll) {
      window.scrollTo(0, 0);
      setScroll(false);
    }
  }, [scroll]);

  useEffect(() => {
    if (isSuccessAddPatient) {
      const { statusCode, message, data } = responseAddPatient?.data || {};
      if (statusCode == 200) {
        setIsUpdated(true)
        setModifyFlag(true)
        // add scan
        if(!patientFound){

            addScanTest(data.id)
        }
      }
    }
    if (isErrorAddPatient) {
      const { statusCode, data, message } = (errorAddPatient as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode == 400) {
        if (Object.keys(data).length > 0) {
          Object.keys(data).map((name) => {
            if (name === 'lastName') {
              setError('firstName', {
                type: 'firstName',
                message: data[name],
              });
              //scroll page to top
              setScroll(true)
            }
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
  }, [responseAddPatient, errorAddPatient])

  useEffect(() => {
    if (isSuccessAddScan) {
      const { statusCode, message, data } = responseAddScan?.data || {};
      if (statusCode == 200) {
        console.log("scan added successfully.", data)
      }
    }
    if (isErrorAddScan) {
      const { statusCode, data, message } = (errorAddScan as AxiosError<ApiResponse>)?.response?.data || {};
      console.log("error", statusCode, data, message)
      setError('form', {
        type: 'form',
        message: message,
      });
    }
  }, [isSuccessAddScan, isErrorAddScan])

  useEffect(() => {
    if (phoneNumber != '')
      getPatient();
  }, [phoneNumber]);

  useEffect(() => {
    if (file !== null) {
      setError('file', {
        type: 'file',
        message: '',
      });
      setValue('file', file)
    }
  }, [file])

  useEffect(() => {
    setIsModalVisible(false)
    if (conflictAction !== '') {
      createPatient()
    }
  }, [conflictAction])

  const validatePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      setValue('phoneNo', e.target.value)
      return
    }
    e.target.value = Math.max(0, parseInt(e.target.value))
      .toString()
      .slice(0, 10);
    setValue('phoneNo', e.target.value)
    getPatientInfo()
    if (e.target.value.length === 10) {
      getPatientInfo();
    }
  };

  const getPatientInfo = async () => {
    const phoneNo = getValues('phoneNo');
    if (phoneNo?.length == 10) {
      const encodedPhoneNumber = encodeURIComponent(`${countryCode}${phoneNo}`);
      setPhoneNumber(encodedPhoneNumber) // when this state patientinfo call trigger
    }
  };

  const addScanTest = (patientId = '') => {
    const testId = getValues('test');
    const testPrice = getValues('testPrice');
    const scanTest: AddPatientForm = {
      testId: testId,
      patientId: patientId,
      file: file,
      testPrice: testPrice,
      priority: getValues('priority')
    }
    const formData: any = new FormData();
    Object.keys(scanTest).forEach(key => {
      formData.append(key, scanTest[key as keyof AddPatientForm]);
    });
    addScanMutate(formData)
  }

  const createPatient = () => {
    const data = getValues();
    const username = data.firstName
    if (username) {
      const [firstName, ...lastNameParts] = username.split(' ');
      const lastName = lastNameParts.join(' ');
      const patientInfo = {
        ...data,
        phoneNo: `${countryCode}${data.phoneNo}`,
        firstName: firstName,
        lastName: lastName
      }
      if (patientFound) {
        patientInfo.conflictAction = conflictAction
      }
      addPatientMutate(patientInfo)
    }
  }

  const onSubmit = (data: AddPatientForm) => {

    if (!patientFound) { // existing not patient found
      createPatient()
      
      return
    }
    if (patientFound && modifyFlag) { // existing patient found and no changes done
      addScanTest(existingPatientId)
      return
    }
    //setIsModalVisible(true);
    return;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSuccess(false)
  };

  const handleModify = () => {
    setModifyFlag(false)
    setPhoneNumber('')
  }

  return (
    <>
      {!isSuccessAddScan ?
        <div className="flex flex-col justify-center w-full container">
          <div className="w-full border-b-2">
            <p className='heading'>Add New Patient/Scan Test</p>
          </div>
          <div className="flex-col w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-5">
                <Typography variant="h6" className='subTitle'>Patient</Typography>
                <div className="input" style={{ position: 'relative' }}>
                  <div>
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
                          field={field}
                          // onBlur={() => getPatientInfo()}
                          onChange={(e) => {
                            validatePhoneNumber(e)
                          }}
                          disabled={modifyFlag || isUpdated}
                        />
                      )}
                    />
                  </div>
                  {loadingPatientDetail && <Loader customStyle={{
                    position: 'absolute',
                    right: '-50px',
                    top: '50px',
                    height: 'unset',
                    margin: 0
                  }} />}
                </div>
                <div className="input">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Patient Name"
                        name="firstName"
                        placeholder="Enter your patient name"
                        register={register}
                        type='text'
                        field={field}
                        errors={errors}
                        onChange={(e) => {
                          trigger('firstName');
                        }}
                        disabled={modifyFlag || isUpdated}
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
                        field={field}
                        errors={errors}
                        onBlur={() => { }}
                        onChange={(e) => {
                          trigger('email');
                        }}
                        disabled={modifyFlag || isUpdated}
                      />
                    )}
                  />
                </div>
                {isUpdated && <div className="updatedPatient" style={{color: '#007d00'}}>
                  Patient is {conflictAction == 'update' ? 'updated' : 'created'} successfully.
                </div> }
                {(patientFound && modifyFlag && !isUpdated) &&
                  <p className="userFoundText">This user is already found, would you like to update their information?
                    <span className="modifyLink" onClick={handleModify}> modify it here</span>
                  </p>}
                {(patientFound && !modifyFlag && !isUpdated) &&
                  <div className='flex gap-4 mt-3' style={{width: '50%'}}>
                  <Button
                    
                    variant='contained'
                    fullWidth
                    onClick={() =>  setConflictAction('update')}
                    sx={{
                      maxWidth: '50%',
                      p: 1,
                      borderRadius: 1,
                      background: '#0F4A8A'
                    }}>Update</Button>
                    <Button
                      fullWidth
                      variant='outlined'
                      onClick={() =>  setConflictAction('remove_and_create')}
                      sx={{
                        
                        maxWidth: '50%',
                        p: 1,
                        borderRadius: 1,
                      }}>Add</Button></div>


                }
              </div>
              <div className="border-t-2 p-5">
                <Typography variant="h6" className='subTitle'>Scan Test</Typography>

                <div className="input">
                  <Controller
                    name="test"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        list={scanList}
                        field={field}
                        isMulti={false}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!errors.test}
                        label="Scan Test"
                        errors={errors}
                        disabled={patientFound && !modifyFlag}
                        name="test"
                      />
                    )}
                  />
                </div>
                <div className="input">
                  <Controller
                    name="testPrice"
                    control={control}
                    render={({ field }: any) => (
                      <InputWithLabel
                        label="Billing Amount"
                        name="testPrice"
                        disabled={patientFound && !modifyFlag}
                        placeholder="Enter your billing amount"
                        register={register}
                        type='number'
                        field={field}
                        errors={errors}
                        onBlur={() => { }}
                        onChange={(e) => {
                          trigger('testPrice');
                        }}
                      />
                    )}
                  />
                </div>
                <div className="input">
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        list={priorityEnum}
                        field={field}
                        isMulti={false}
                        disabled={patientFound && !modifyFlag}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!errors.test}
                        label="Priority"
                        errors={errors}
                        name="priority"
                      />
                    )}
                  />
                </div>
                <div>
                  <Upload label="Does patient have previous prescription?"  setFile={setFile} file={file} disabled={patientFound && !modifyFlag} />
                  {errors.file && (
                    <p className="error">
                      {typeof errors.file === 'string'
                        ? errors.file
                        : (errors.file as FieldError)?.message
                          ? (errors.file as FieldError).message
                          : typeof errors.file === 'object'
                            ? '' // Add additional checks if needed
                            : ''}
                    </p>
                  )}
                </div>
              </div>
              {errors.form && <p className="formError">{errors?.form?.message}</p>}
              <div className="input" style={{
                display: 'flex',

              }}>
                <Button
                  type='submit'
                  variant='contained'
                  fullWidth
                  disabled={patientFound && !modifyFlag}
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
                  disabled={patientFound && !modifyFlag}
                  onClick={() => router.back()}
                  sx={{
                    margin: '10px 0px 20px 20px',
                    minWidth: 'unset',
                    p: 1,
                    borderRadius: 1,
                  }}>Cancel</Button>
              </div>
            </form>
          </div>
          {/* Dialog for confirming */}
          <CustomModal
            isVisible={isModalVisible}
            handleCancelButton={handleCancel}
            modalTitle="Confirm update?"
            modalMessage="Are you sure you would like to update existing user information."
            showButtons={true}
            primaryButtonText="Update"
            secondaryButtonText="Create New"
            primaryButtonColor="#0f4a8a"
            secondaryButtonColor="#FFF"
            handlePrimaryButton={() => setConflictAction('update')}
            handleSecondaryButton={() => setConflictAction('remove_and_create')}
            success={success}
            icon={() => <BorderColorIcon style={{ color: 'grey', margin: 10 }} />}
          />
        </div> :
        <Verify
          message={patientFound ? "Test added successfully" : "Patient added successfully"}
          label="Go to Manage Patients"
          handleClick={() => router.push('/dashboard/patients')}
        />
      }
    </>
  )
}


