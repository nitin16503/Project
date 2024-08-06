'use client'

import React, { useEffect, useState } from 'react';
import './forgotpass.css';
import Testimonials from '@/src/components/testimonials/testimonials';
import Verify from '@/src/components/verify/verify';
import Button from '@/src/components/button/button';
import InputWithLabel from '@/src/components/input/input';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiResponse, ForgotPassFormData } from '@/src/utils/types';
import { useForgotPasswordMutation, useFpchangeMutation } from '@/src/api/forgot-password';
import { AxiosError } from 'axios';
import { ForgetPasswordFormData } from '@/src/utils/types';

export default function ForgotPassword() {

    const searchParams = useSearchParams();
    const email = searchParams?.get('email')
    const code = searchParams?.get('code');
    const [isrender, setRender] = useState({ email: true, password: false, verify: false })
    const [parentContainerHeight, setParentContainerHeight] = useState('auto');

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            if (windowHeight > 700) {
                setParentContainerHeight('100%');
            }
            else {
                setParentContainerHeight('auto');
            }
        };
        if (email && code) {
            setRender({ email: false, password: true, verify: false })
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="loginParentContainer" style={{ height: parentContainerHeight }}>
            <div className='loginContainer'>
                <div className='sideScreen'>
                    <Testimonials />
                </div>
                <div className='login'>
                    {
                        (email && code)
                            ? <ForgotPasswithoutEmail email={email} code={code} /> : <ForgotPassonlyEmail />
                    }
                </div>
            </div>
        </div>
    );
}


const ForgotPasswithoutEmail: React.FC<{ email: string, code: string }> = ({ email, code }) => {

    const router = useRouter();
    const [isVerify, setIsVerify] = useState(false);
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
    } = useForm<ForgotPassFormData>({
        resolver: yupResolver(validationSchema),
    });
    const { isFpchangeError,
        fpchangeError,
        isFpchangeSuccess,
        FpchangeStatus,
        fpchangeResponse,
        fpchangeMutate, } = useFpchangeMutation();

    useEffect(() => {
        if (isFpchangeSuccess) {
            const { statusCode, data } = fpchangeResponse?.data || {};
            if (statusCode === 200) {
                setIsVerify(true)
            }
        }
        else if (isFpchangeError) {
            const { statusCode, message } = (fpchangeError as AxiosError<ApiResponse>)?.response?.data ?? {};
            if (statusCode === 400) {
                setError('form', {
                    type: 'form',
                    message: message,
                });
            }
        }
    }, [fpchangeResponse, isFpchangeError, isFpchangeSuccess]);

    const onSubmit = (data: ForgotPassFormData) => {
        const postData: any = {
            ...data,
            code,
            email
        };
        fpchangeMutate(postData);
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
                                    disabled={!isValid || (FpchangeStatus && FpchangeStatus ? true : false)}
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
                    message='Password Changed Successfully'
                    label='Password changed'
                    handleClick={() => router.push('/login')}
                />
            )
    );
}

const ForgotPassonlyEmail = () => {

    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
    });
    const router = useRouter();
    const [isVerify, setIsVerify] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        control,
        formState: { errors, isValid },
    } = useForm<ForgetPasswordFormData>({
        resolver: yupResolver(validationSchema),
    });
    const { isForgotPasswordError,
        forgotPasswordError,
        isForgotPasswordSuccess,
        forgotPasswordResponse,
        forgotPasswordMutate, } = useForgotPasswordMutation();

    useEffect(() => {
        if (isForgotPasswordSuccess) {
            const { statusCode, data, message } = forgotPasswordResponse?.data || {};
            if (statusCode === 200) {
                setIsVerify(true)

            }
        }
        else if (isForgotPasswordError) {
            const { statusCode, data, message } = (forgotPasswordError as AxiosError<ApiResponse>)?.response?.data || {};
            console.log(data, 'error in email sending');

        }
    }, [forgotPasswordResponse, isForgotPasswordSuccess]);

    const onSubmit = (data: ForgetPasswordFormData) => {
        forgotPasswordMutate(data.email);
    };
    const hasFieldError = () => {
        const res = ['email'].some((fieldName) => (errors as any)[fieldName]);
        return res;
    };

    return (
        <>
            {
                !isVerify ? <div className="changePassword flex flex-col">
                    <div className="changePasswordContainer flex flex-col items-center justify-center w-full">
                        <div className="w-full title items-start flex flex-col">
                            Update Password
                        </div>
                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form flex flex-col w-full">
                                <div className="flex flex-col" style={{ rowGap: '20px' }}>
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

                                </div>
                                {!hasFieldError() && errors.form && <p className="formError">{errors.form.message}</p>}
                                <div className="loginButton">
                                    <Button
                                        type="submit"
                                        label="Update Password"
                                        disabled={!isValid}
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
                    : <Verify
                        message='Email Sent'
                        label='Go to Login'
                        handleClick={() => router.push('/login')}
                    />
            }
        </>

    )
}