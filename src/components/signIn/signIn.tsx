"use client";

import React, { useContext, useEffect } from 'react';
import './signIn.css';
import InputWithLabel from '../input/input';
import { sendGTMEvent } from '@next/third-parties/google'
import Button from '../button/button';
import StaticButton from '../staticButton/staticButton';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query'
import { LoginForm, ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { loginMutation } from '@/src/api/user';
import { setUserInfo } from '@/src/utils/helper';
import { SocketContext, SocketContextType } from '@/src/providers/EventListener';

interface FormData {
  email: string;
  password: string;
  rememberMe?: boolean;
  form?: boolean
};

const SignInComponent: React.FC = () => {

  const router = useRouter();
  const { initialiseSocket } = useContext<SocketContextType>(SocketContext);

  const queryClient = useQueryClient();
  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    rememberMe: yup.boolean()
  });
  const { register, handleSubmit, control, setError, getValues, trigger, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const userAgent = typeof window !== "undefined" && navigator.userAgent;
  const platform = typeof window !== "undefined" && navigator.platform;
  const { handleLoginError, loginError, handleLoginSuccess, loginResponse, loginStatus, loginMutate } = loginMutation()

  useEffect(() => {
    if (handleLoginSuccess) {
      const { statusCode, data } = loginResponse?.data || {};
      if (statusCode == 200) {
        queryClient.setQueryData(['user'], data.date);
        const userInfo = {
          token: data?.accessToken,
          activeCenter: data?.activeCenter,
          level: data?.date?.userLevel,
          name: `${data?.date?.firstName} ${data?.date?.lastName}`,
          userId: data?.date?.id,
          centerList: data?.date?.centers
        }
        setUserInfo(JSON.stringify(userInfo))
        
        initialiseSocket();
        router.push('/dashboard');
        //initialiseSocket()
      }
    }

  }, [handleLoginSuccess])

  useEffect(() => {
    if (handleLoginError) {
      const { statusCode, message } = (loginError as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log(message, 'error');

      if (statusCode == 401) {
        setError('form', {
          type: 'manual',
          message: message,
        });
      }
    }
  }, [handleLoginError])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    //Post data
    const postData: LoginForm = {
      "email": data.email,
      "password": data.password,
      "ip": "127.0.0.1",
      "platform": platform || '',
      "device": userAgent || ''
    }
    // Handle login 
    sendGTMEvent({ event: 'buttonClicked', value: 'Login Button clicked' })
    loginMutate(postData)
  };

  const handleRegisterClick = () => {
    sendGTMEvent({ event: 'textLink', value: 'Register Text clicked' })
    router.push('/signup');
  };

  return (
    <div className="signIn flex flex-col">
      <div className="signInContainer flex flex-col items-center justify-center w-full">
        <div className="w-full title  items-start flex flex-col">
          Sign In
          <p className="subTitle">
            Don't have an account? <span onClick={handleRegisterClick} className="register">Register</span>
          </p>
        </div>
        <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className="form flex flex-col w-full">
            <div className='flex flex-col' style={{ rowGap: '20px' }}>
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
                    type='email'
                    errors={errors}
                    field={field}
                    onChange={() => trigger('email')}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field }: any) => (
                  <InputWithLabel
                    label="Password"
                    placeholder="Enter your password"
                    register={register}
                    name='password'
                    type='password'
                    errors={errors}
                    field={field}
                    onChange={() => trigger('password')}
                  />
                )}
              />
            </div>
            <div className="boxContainer flex flex-row justify-between items-center">
              <label className="checkboxLabel">
                <input type="checkbox"  {...register('rememberMe')} />
                Remember Me
              </label>
              <p className="forgotPass" onClick={()=> {
                sendGTMEvent({ event: 'textLink', value: 'Forgot Password Text clicked' })
                router.push('/forgotpassword')}}>
                Forgot Password?
              </p>
            </div>
            {errors.form && <p className="formError">{errors.form.message}</p>}
            <div className="loginButton">
              <Button
                type="submit"
                label="Login"
                disabled={!isValid || (loginStatus && loginStatus ? true : false)}
                btnStyle={{
                  color: '#fff',
                  backgroundColor: '#f0a400',
                  width: "100%"
                }}
              />
            </div>
            {/* <div className="horizontalLineContainer">
            <div className="horizontalLine"></div>
            <div className="orText">OR</div>
            <div className="horizontalLine"></div>
          </div>
          <div className="signInWithGoogle">
            <StaticButton
              label="Login with Google"
              onClick={handleSubmit}
              color="#00a7b3"
              bgColor="#fff"
              width="100%"
              borderColor="#00a7b3"
              logo='./images/google_logo.svg'
            />
          </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInComponent;
