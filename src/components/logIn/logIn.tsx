"use client";

import React, { useEffect, ChangeEvent } from 'react';
import './logIn.css';
import InputWithLabel from '../input/input';
import { sendGTMEvent } from '@next/third-parties/google'
import Button from '../button/button';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { otpLoginMutation } from '@/src/api/user';
import OTP from '../otp/otp';
import { OTPFormData } from '@/src/utils/types';
import BackButton from '../backButton/backButton';
import { useQueryClient } from '@tanstack/react-query'
import { setUserInfo } from '@/src/utils/helper';

const LogIn: React.FC = () => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const [sendOTP, setSendOTP] = React.useState(false);
    const countryCode = '+91';
    const validationSchema = yup.object().shape({
        phoneNo: yup.string().required('Phone number is required').min(10, 'Enter a 10-digit phone number'),
        otpCode: yup.string().required('OTP is required').matches(/^\d{5}$/, 'Enter a 5-digit OTP'),
    });
    const { register, handleSubmit, control, setError, setValue, getValues, trigger, formState: { errors, isValid } } = useForm<OTPFormData>({
        resolver: yupResolver(validationSchema),
    });

    const { handleLoginError, loginError, handleLoginSuccess, loginResponse, loginStatus, loginMutate } = otpLoginMutation()
    useEffect(() => {
        if (handleLoginSuccess) {
            const { statusCode, data } = loginResponse?.data || {};
            if (statusCode == 200) {
                queryClient.setQueryData(['user'], data.data);
                const userInfo = {
                    token: data?.accessToken,
                    level: 'patient',
                    name: `${data?.data?.firstName} ${data?.data?.lastName}`,
                    userId: data?.data?.id,
                    centerList: data?.data?.centers
                }
                setUserInfo(JSON.stringify(userInfo))
                router.push('/dashboard');
            }
        }
        if (handleLoginError) {
            const { statusCode, message } = (loginError as AxiosError<ApiResponse>)?.response?.data ?? {};
            if (statusCode == 401) {
                setError('form', {
                    type: 'manual',
                    message: message,
                });
            }
        }
    }, [loginResponse, loginError])

    const validatePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == '') {
            setValue('phoneNo', e.target.value)
            return
        }
        e.target.value = Math.max(0, parseInt(e.target.value))
            .toString()
            .slice(0, 10);
        setValue('phoneNo', e.target.value)
    };

    const onSubmit: SubmitHandler<OTPFormData> = (data) => {
        if (isValid) {
            loginMutate({
                phoneNo: `+91${data.phoneNo}`,
                otpCode: data.otpCode
            })
            sendGTMEvent({ event: 'buttonClicked', value: 'Login Button clicked' })
        }
    };

    const handleSendOtp = () => {
        setSendOTP(true)
    }

    const handlebackbtn = () => {
        setSendOTP(false)
    }

    return (
        <div className="signIn flex flex-col">
            <div className="backButton">
                {sendOTP && <BackButton onclick={handlebackbtn} />}
            </div>
            <div className="signInContainer flex flex-col items-center justify-center w-full">
                <div className="w-full title  items-start flex flex-col">
                    {sendOTP ? 'OTP' : 'Log In'}
                    <p className="subTitle">
                        {sendOTP ? 'Verify OTP, send to your phone number' : ' Log in to see your results'}
                    </p>
                </div>
                <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form flex flex-col w-full">
                        {!sendOTP ?
                            <div className='numberContainer'>
                                <div style={{ color: '#333', fontWeight: 'normal' }} className='defaultNo'>{countryCode}</div>
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
                                            field={field}
                                            errors={errors}
                                            onChange={(e) => {
                                                validatePhoneNumber(e)
                                                trigger('phoneNo')
                                            }}
                                        />
                                    )}
                                />
                            </div> :
                            <div>
                                <Controller
                                    name="otpCode"
                                    control={control}
                                    render={({ field }) => (
                                        <OTP
                                            name='otpCode'
                                            errors={errors}
                                            field={field}
                                            register={register}
                                            onChange={() => trigger('otpCode')}
                                        />
                                    )}
                                />
                            </div>
                        }
                        {errors.form && <p className="formError">{errors.form.message}</p>}
                        <div className="loginButton">
                            {!sendOTP ? <Button
                                type="button"
                                onClick={handleSendOtp}
                                label="Send OTP"
                                disabled={!!errors['phoneNo'] || (getValues('phoneNo') == undefined) }
                                btnStyle={{
                                    color: '#fff',
                                    backgroundColor: '#f0a400',
                                    width: "100%"
                                }}
                            /> :
                                <Button
                                    type="submit"
                                    label="Verify"
                                    disabled={!!errors['otpCode']}
                                    btnStyle={{
                                        color: '#fff',
                                        backgroundColor: '#f0a400',
                                        width: "100%"
                                    }}
                                />}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogIn;
