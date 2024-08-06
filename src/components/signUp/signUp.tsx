'use client'

import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import './signUp.css';
import { sendGTMEvent } from '@next/third-parties/google'
import InputWithLabel from '../input/input';
import Button from '../button/button';
import StaticButton from '../staticButton/staticButton';
import SignUpHeader from '../signUpHeader/signUpHeader';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { getOtpMutation, verifyOtpMutation, verifyEmailMutation } from '@/src/api/user';

const validationSchema = yup.object().shape({
  //fullName: yup.string().required('Full Name is required'),
  fullName: yup.string().test({
    name: 'firstName-lastName-required',
    exclusive: false,
    message: 'First Name and Last Name are required in the fullname',
    test: function (value: any) {
      // Split the value into words
      const trimmedValue = value?.trim();

      // Split the trimmed value into words
      const words = trimmedValue?.split(' ');

      // Check if there are at least two words (firstname and lastname)
      return words?.length >= 2 && words[words?.length - 1] !== '';
    },
  }),
  phoneNumber: yup.string().required('Mobile Number is required').min(10,'Mobile Number is required'),
  otp: yup.string().required('Otp is required'),
  rePassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match').required('Confirm'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must meet the criteria'
    )
    .required('Password is required'),
});

interface errorType {
  [key: string]: string
}
interface FormData {
  fullName: string,
  phoneNumber: string,
  otp: string,
  rePassword: string,
  email: string;
  password: string;
  form?: boolean
};

interface signupFormData {
  fullName: string,
  phoneNumber: string,
  otp: string,
  rePassword: string,
  email: string;
  password: string;
  verify: {
    isOtpValid: boolean,
    isPhoneValid: boolean,
    isVerify: boolean
  }
};

interface signupFormData2 {
  fullName: string,
  phoneNumber: string,
  otp: string,
  rePassword: string,
  email: string;
  password: string;
};

interface SignUpProps {
  handleScreen: (status: boolean, step: string) => void;
  handleSignUpData: (data: signupFormData) => void;
  previousSignupData: signupFormData;
  apiError: errorType
}

const SignUp: FC<SignUpProps> = ({ handleScreen, handleSignUpData, apiError, previousSignupData }) => {

  const [showOtpField, setShowOtpField] = useState(previousSignupData?.otp != '' ? true : false);
  const [isVerify, setVerify] = useState(previousSignupData.verify.isVerify);
  const [belowThreshold, setBelowThreshold] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(previousSignupData.verify.isPhoneValid);
  const [isOtpValid, setIsOtpValid] = useState(previousSignupData.verify.isOtpValid);
  const { control, register, handleSubmit, setError, setValue, trigger, clearErrors, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      fullName: previousSignupData?.fullName || '',
      phoneNumber: previousSignupData?.phoneNumber || '',
      otp: previousSignupData?.otp || '',
      rePassword: previousSignupData?.rePassword || '',
      email: previousSignupData?.email || '',
      password: previousSignupData?.password || '',
    },
  });
  const {
    isverifyOtpError,
    verifyOtpError,
    isverifyOtpSuccess,
    verifyOtpResponse,
    verifyOtpMutate,
  } = verifyOtpMutation()
  const {
    isverifyEmailError,
    verifyEmailError,
    isverifyEmailSuccess,
    verifyEmailResponse,
    verifyEmailMutate
  } = verifyEmailMutation()
  const {
    handleOtpError,
    otpError,
    handleOtpSuccess,
    otpResponse,
    otpMutate,
  } = getOtpMutation()

  useEffect(() => {
    const handleResize = () => {
      setBelowThreshold(window.innerWidth < 1247);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    setTimeout(() => {
      Object.keys(apiError).forEach((data: string) => {
        if (data === 'lastName' || data === 'firstName') {
          setError('fullName', {
            type: 'fullName',
            message: apiError.lastName
          })
        }
        else if (data === 'phoneNo') {
          setError('phoneNumber', {
            type: 'phoneNumber',
            message: apiError.phoneNo
          })
        }
        else if (data === 'email') {
          setError(data, {
            type: 'email',
            message: apiError.email
          })
        }
        else if (data === 'password') {
          setError(data, {
            type: data,
            message: apiError.password
          })
        }
      });
    }, 0)
  }, [])

  type FormField = keyof signupFormData2;
  useEffect(() => {
    if (previousSignupData) {
      const { verify, ...dataWithoutVerify } = previousSignupData;
      Object.keys(dataWithoutVerify).forEach((fieldName: string) => {
        const typedFieldName = fieldName as FormField;
        setValue(typedFieldName, dataWithoutVerify[typedFieldName]);
      });
      if (previousSignupData.verify.isVerify) {
        trigger();
      }
    }
  }, [previousSignupData, setValue, trigger]);

  useEffect(() => {
    if (isverifyOtpError) {
      const { statusCode, message } = (verifyOtpError as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode == 401) {
        setError('otp', {
          type: 'otp',
          message
        })
      }
    }
    else if (isverifyOtpSuccess) {
      clearErrors('otp');
      const { statusCode, message } = verifyOtpResponse?.data || {};
      if (statusCode == 200) {
        setVerify(true)

      }
    }
  }, [isverifyOtpError, isverifyOtpSuccess])

  useEffect(() => {
    if (handleOtpError) {
      const { statusCode, data } = (otpError as any)?.response?.data || {};
      if (statusCode == 400) {
        setError('phoneNumber', {
          type: 'phoneNumber',
          message: data?.phoneNo //code is working fine with this error 
        })
      }
    }
    else if (handleOtpSuccess) {
      clearErrors('phoneNumber');
      const { statusCode, message } = otpResponse?.data || {};
      if (statusCode == 200) {
        setShowOtpField(true)
      }
    }
  }, [handleOtpError, handleOtpSuccess])

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
      clearErrors('email');
    }
  }, [isverifyEmailError, isverifyEmailSuccess])

  const handleSendOtp = () => {
    let phoneNumber = getValues('phoneNumber').toString();
    if (!phoneNumber.startsWith('+91')) {
      phoneNumber = '+91' + phoneNumber;
    }
    sendGTMEvent({ event: 'buttonClicked', value: 'Send OTP Button clicked' })
    otpMutate(phoneNumber);
  };

  const validatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    e.target.value = Math.max(0, parseInt(e.target.value))
    .toString()
    .slice(0, 10);
    setValue('phoneNumber',e.target.value)
    if(e.target.value.toString().length ===10){
      setIsPhoneValid(true)
    }
  };

  const validateOtp = (e: ChangeEvent<HTMLInputElement>) => {
    const otp = e.target.value;
    if (isPhoneValid) {
      if (typeof otp === 'string' && otp.length === 5) {
        setIsOtpValid(true)
      } else {
        setIsOtpValid(false)
      }
    }
    trigger('otp')
  };


  const handleVerifyOtp = () => {
    let phoneNumber = getValues('phoneNumber').toString();
    if (!phoneNumber.startsWith('+91')) {
      // If not, add +91 to the beginning
      phoneNumber = '+91' + phoneNumber;
    }
    sendGTMEvent({ event: 'buttonClicked', value: 'Verify Otp Button clicked' })
    verifyOtpMutate({ phoneNo: phoneNumber, otpCode: getValues('otp') })
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    sendGTMEvent({ event: 'buttonClicked', value: 'SignUp Next Button clicked' })
    if (isValid) {
      handleSignUpData({ ...data, verify: { isOtpValid, isPhoneValid, isVerify } });
      handleScreen(true, 'step1')
    }
    else {
      console.log('validation Error');
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
    if (val.length > 0) {
      verifyEmailMutate(val)
    }
    trigger('email')
  };

  return (
    <div className="signUp flex flex-col">
      <div className="signUpContainer flex flex-col items-center justify-center w-full">
        <SignUpHeader />
        <div className=" parentForm flex flex-col w-full ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form flex flex-col">
              <div className="formRow flex">
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue={previousSignupData?.fullName || ''}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Full Name"
                      placeholder="Enter your full name"
                      register={register}
                      name='fullName'
                      type='text'
                      errors={errors}
                      field={field}
                      onChange={() => trigger('fullName')}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue={previousSignupData?.email || ''}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      register={register}
                      name='email'
                      errors={errors}
                      field={field}
                      onBlur={() => setEmailError()}
                      onChange={() => trigger('email')}
                    />
                  )}
                />
              </div>
              {/* Second row: Phone Number and Send OTP button */}
              <div className="formRow phoneNo flex">
                <div style={{ color: '#333', fontWeight: 'normal' }} className='defaultNo'>+91</div>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Mobile Number"
                      name="phoneNumber"
                      placeholder="Enter your mobile number"
                      register={register}
                      disabled={isVerify}
                      type='number'
                      field={field}
                      errors={errors}
                      onChange={(e) => {
                        trigger('phoneNumber');
                        validatePhone(e); // Additional validation on change
                      }}
                    />
                  )}
                />
                {
                  (!showOtpField) &&
                  <div className="otpButton" style={{ alignSelf: 'start', flex: 1 }}>
                    {!belowThreshold && (
                      <label className="label" style={{ visibility: 'hidden', fontSize: '22px' }}>Send Otp</label>
                    )}
                    <div style={{ marginTop: '3.5px' }}>
                      <Button
                        label="Send OTP"
                        onClick={handleSendOtp}
                        type='button'
                        btnStyle={{
                          color: '#fff',
                          backgroundColor: "#f0a400",
                          width: "100%",
                          height: "60px"
                        }}
                        disabled={!isPhoneValid }
                      />
                    </div>
                  </div>
                }
                {showOtpField && (
                  <div className="formRow flex" style={{ columnGap: '12px' }}>
                    <Controller
                      name="otp"
                      control={control}
                      rules={{ required: 'OTP is required' }}
                      defaultValue={previousSignupData?.otp || ''}
                      render={({ field }: any) => (
                        <InputWithLabel
                          label="OTP"
                          placeholder="Enter OTP"
                          name='otp'
                          type='number'
                          onChange={validateOtp}
                          width='50%'
                          errors={errors}
                          disabled={isVerify || (previousSignupData?.otp ? true : false)}
                          register={register}
                          field={field}
                          onBlur={() => setFieldError('otp', 'OTP is required')}
                        />
                      )}
                    />
                    <div className="verify" style={{ alignSelf: belowThreshold ? 'end' : 'start' }}>
                      {
                        isVerify ? (
                          <div className="verifyIcon">
                            <CheckCircleOutlineIcon
                              sx={{ color: 'success.main', marginLeft: '3px', alignSelf: 'center', height: '60px', width: '30px' }}
                            />
                          </div>
                        ) : (
                          <>
                            {!belowThreshold && (
                              <label className="label" style={{ visibility: 'hidden', fontSize: '22px' }}>Send Otp</label>
                            )}
                            <div className="verifyButton" style={{ marginTop: '3.5px' }}>
                              <StaticButton
                                label="Verify"
                                onClick={handleVerifyOtp}
                                color="#fff"
                                height="60px"
                                bgColor="#ccc"
                                width="100%"
                                disabled={!isOtpValid}
                              />
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
              {/* Conditional rendering of OTP field */}
              {/* Third row: Password and Re-Password */}
              <div className="formRow flex">
                <Controller
                  name="password"
                  control={control}
                  defaultValue={previousSignupData?.password || ''}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      name='password'
                      errors={errors}
                      register={register}
                      field={field}
                      //  onBlur={() => setFieldError('password', 'Password is required')}
                      onChange={() =>
                        trigger('password')
                      }
                    />
                  )}
                />
                <Controller
                  name="rePassword"
                  control={control}
                  rules={{ required: 'Password is required' }}
                  defaultValue={previousSignupData?.rePassword || ''}
                  render={({ field }: any) => (
                    <InputWithLabel
                      label="Re-Password"
                      type="password"
                      placeholder="Re-enter your password"
                      name='rePassword'
                      errors={errors}
                      register={register}
                      field={field}
                      // onBlur={() => setFieldError('rePassword', 'Confirm Password is required')}
                      onChange={() =>
                        trigger('rePassword')
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="passwordNote">
              *Your password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, , &, ?).
            </div>
            <div className="signUpButton">
              <Button
                label="Next"
                type='submit'
                disabled={!isValid || !isVerify}
                btnStyle={{
                  color: '#fff',
                  backgroundColor: '#f0a400',
                  width: "100%"
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;