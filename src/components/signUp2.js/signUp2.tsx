import React, { FC, useEffect } from 'react';
import './signUp2.css';
import Button from '../button/button';
import SignUpHeader from '../signUpHeader/signUpHeader';
import InputWithLabel from '../input/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel'; // Import InputLabel
import { yupResolver } from '@hookform/resolvers/yup';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { signupMutation } from '@/src/api/user';
import SelectInput from '../selectInput/selectInput';

interface Center {
  name: string;
  modalities: string[];
  healthCareTypes: string[];
}
interface FinalObj {
  password: string;
  email: string;
  confirmPassword: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  otpCode: string;
  center: Center;
}

const validationSchema = yup.object().shape({
  healthCareFacilityName: yup.string().required('Name of Health Care Facility is required'),
  selectedHeathCareType: yup.string().required('Type of Health Care Facility is required'),
  selectedModality: yup.string().required('Type of Modalities is required'),
});

interface signUpData {
  fullName: string,
  phoneNumber: string,
  otp: string,
  rePassword: string,
  email: string;
  password: string;
}

interface FormData {
  healthCareFacilityName: string;
  selectedHeathCareType: string;
  selectedModality: string;
  form?: boolean
}

interface errorType {
  [key: string]: string
}

interface SignUpProps {
  handleScreen: (status: boolean, step: string) => void;
  signUpData: signUpData;
  handleSetError: (data: errorType) => void;
  handleSignUp2Data: (data: FormData) => void;
  signup2PrevData: FormData;
  data: { healthCareTypes: { name: string, _id: string }[]; modalities: { name: string, _id: string }[] };
}

const SignUp2: FC<SignUpProps> = ({ handleScreen, data, handleSetError, handleSignUp2Data, signup2PrevData, signUpData }) => {

  const { control, register, handleSubmit, setError, trigger, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      healthCareFacilityName: signup2PrevData?.healthCareFacilityName,
      selectedHeathCareType: signup2PrevData?.selectedHeathCareType,
      selectedModality: signup2PrevData?.selectedModality,
    },
  });

  const {
    isSignupError,
    signupError,
    isSignupSuccess,
    signupResponse,
    signupMutate,
    signUpStatus,
  } = signupMutation()

  useEffect(() => {
    if (isSignupError) {
      const { statusCode, message, data } = (signupError as AxiosError<ApiResponse>)?.response?.data || {};
      data ? handleSetError(data) : ''

      if (statusCode == 400) {
        setError('form', {
          type: 'form',
          message
        })
      }
    }
    else if (isSignupSuccess) {
      const { statusCode, message } = signupResponse?.data || {};
      if (statusCode == 200) {
        handleScreen(true, 'step2')
      }
    }
  }, [isSignupError, isSignupSuccess])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    let finalObj = {
      "password": signUpData.password,
      "email": signUpData.email,
      "confirmPassword": signUpData.rePassword,
      "phoneNo": `+91${signUpData.phoneNumber}`, // Assuming phoneNo needs a '+' prefix
      "firstName": signUpData.fullName.split(' ')[0], // Assuming first word is first name
      "lastName": signUpData.fullName.split(' ')[1] || "", // Assuming second word is last name (if available)
      "otpCode": "99999",
      "center": {
        "name": data.healthCareFacilityName,
        "modalities": [data.selectedModality],
        "healthCareTypes": [data.selectedHeathCareType]
      }
    };
    signupMutate(finalObj)
    // Perform form submission logic
  };

  const handleBackClick = () => {
    const formData = getValues();
    handleSignUp2Data(formData);
    handleScreen(false, 'step2')
  }

  return (
    <div className="signUp flex flex-col">
      <div className="signUpContainer flex flex-col items-center justify-center w-full">
        <div className="signupHeader">
          <SignUpHeader />
          <div className="backButton">
            <IconButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
          </div>
        </div>
        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full ">
            <div className="form flex flex-col">
              <div className="formRow flex">
                <Controller
                  name="healthCareFacilityName"
                  control={control}
                  rules={{ required: 'fullName is required' }}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Name of Health Care Facility"
                      placeholder=""
                      register={register}
                      errors={errors}
                      name='healthCareFacilityName'
                      width="100%"
                      field={field}
                      onChange={() => trigger('healthCareFacilityName')}
                    />
                  )}
                />
              </div>
              <div className="formRow flex">
                <Controller
                  name="selectedHeathCareType"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      list={data.healthCareTypes}
                      field={field}
                      isMulti={false}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={!!errors.selectedHeathCareType}
                      label="Type of Health Care Facility"
                      errors={errors}
                      name="selectedHeathCareType"
                    />
                  )}
                />
              </div>
              <div className="formRow flex">
                <Controller
                  name="selectedModality"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      list={data.modalities}
                      field={field}
                      isMulti={false}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={!!errors.selectedModality}
                      label="Type of Modalities"
                      errors={errors}
                      name="selectedModality"
                    />
                  )}
                />
              </div>
            </div>

            <div className="signUpButton">
              {errors.form && <p className="error" style={{ marginBottom: '10px' }}>{errors.form.message}</p>}
              <Button
                label="Sign Up"
                type='submit'
                disabled={!isValid || (signUpStatus && signUpStatus ? true : false)}
                btnStyle={{
                  color: '#fff',
                  backgroundColor: '#f0a400',
                  width: "100%"
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp2;
