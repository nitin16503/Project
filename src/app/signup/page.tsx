'use client'
import React, { useEffect, useState } from 'react';
import './signUp.css';
import SignUp from '../../components/signUp/signUp';
import SignUp2 from '../../components/signUp2.js/signUp2';
import SignUp3 from '@/src/components/signUp3/signUp3';
import Testimonials from '@/src/components/testimonials/testimonials';
import { getSignupForm } from '@/src/api/user';

interface FormData  {
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

interface errorType {
  [key: string] : string
}
interface signup2FormData {
  healthCareFacilityName: string;
  selectedHeathCareType: string;
  selectedModality: string;
}

export default function Signup() {
  
  const [screenObj, setScreenObj] = useState({
    step1: true,
    step2: false,
    step3: false,
  });
  const signUpObj = {
    fullName: '',
    phoneNumber: '',
    otp: '',
    rePassword: '',
    email: '',
    password: '',
    verify: {
      isOtpValid: false,
      isPhoneValid: false,
      isVerify: false
    }
  }

  const signUp2Obj = {
    healthCareFacilityName: '',
    selectedHeathCareType: '',
    selectedModality: '',
  }

  const [signUpData, setSignUpData] = useState<FormData>(signUpObj);
  const [signUp2Data, setSignUp2Data] = useState<signup2FormData>(signUp2Obj);
  const [parentContainerHeight, setParentContainerHeight] = useState('auto');
  const [apiError, setApiError] = useState({});
  const { signupForm } = getSignupForm();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (windowWidth < 1186) {
        if(windowHeight < 1000){
          setParentContainerHeight('auto');
        }
        else{
          setParentContainerHeight('100%');
          
        }
      } else if (windowWidth > 1186 ) {
        if(windowHeight > 700){
          setParentContainerHeight('100%');
        }
        else{
          setParentContainerHeight('auto');
        }

      }
    };

    // Initial call to set the height
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSignUpData = (data: FormData)=>{
    setSignUpData((prevState) => ({
      ...prevState,
      ...data
    }));
  }

  const handleSetError = (data: errorType)=>{
    setApiError(data)
  }

  const handleSignUp2Data = (data: signup2FormData)=>{

    setSignUp2Data((prevState) => ({
      ...prevState,
      ...data
    }));
  }

  useEffect(() => {
  }, [screenObj]);

  const handleScreen = (status: boolean, step: string) => {
    if (status && step === 'step1') {
      setScreenObj({ ...screenObj, step1: !status, step2: status });
    }
    else if (status && step === 'step2') {
      setScreenObj({ ...screenObj, step2: !status, step3: status });
    }
    else if (!status && step === 'step2') {
      setScreenObj({ ...screenObj, step2: status, step1: !status });
    }
  };

  return (
    <>
      <div className="parentContainer" style={{ height: parentContainerHeight }}>
        <div className="signUpParentContainer">
          <div className="sideScreen">
            <Testimonials/>
          </div>
          <div className="signUpParent">
            {screenObj.step1 && <SignUp handleScreen={handleScreen} apiError={apiError} handleSignUpData={handleSignUpData} previousSignupData={signUpData}  />}
            {screenObj.step2 && <SignUp2 handleScreen={handleScreen} handleSetError={handleSetError} handleSignUp2Data={handleSignUp2Data} data={signupForm?.data?.data} signUpData={signUpData} signup2PrevData={signUp2Data}  />}
            {screenObj.step3 && <SignUp3 />}
          </div>
        </div>
      </div>
    </>
  );
}
