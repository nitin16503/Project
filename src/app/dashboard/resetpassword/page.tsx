"use client";

import React, { useEffect, useState } from 'react'
import './resetpassword.css'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiResponse, RestFormData } from '@/src/utils/types';
import { Controller, useForm } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { resetPasswordMutation } from '@/src/api/dashboard';
import { AxiosError } from 'axios';
import Verify from '@/src/components/verify/verify';
import { useRouter } from 'next/navigation';
import { logoutMutation } from '@/src/api/user';

const validationSchema = yup.object().shape({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup
        .string()
        .required('New Password is required'),
    confirmNewPassword: yup
        .string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one digit, and one special character'
        )
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function ResetPassword() {

    const router = useRouter();
    const { control, register, handleSubmit, setError, trigger, getValues, formState: { errors, isValid } } = useForm<RestFormData>({
        resolver: yupResolver(validationSchema),
    });
    const { logout } = logoutMutation()
    const [timer, setTimer] = useState(5);
    const [isChanged, setIsChanges] = useState(false);
    const {
        handleResetPasswordError,
        resetPasswordError,
        handleResetPasswordSuccess,
        handleResetPasswordStatus,
        resetPasswordResponse,
        resetPasswordMutate } = resetPasswordMutation();
    const fieldNames = ['pasnewPasswordsword', 'confirmNewPassword'];
    const hasFieldError = () => {
        const res = fieldNames.some((fieldName) => (errors as any)[fieldName]);
        return res;
    };

    useEffect(() => {
        if (handleResetPasswordSuccess) {
            const { statusCode, data } = resetPasswordResponse?.data || {};
            if (statusCode == 200) {
                setIsChanges(true)
                // setTimeout(() => {
                //     clearInterval(timeInterval)
                //     logout();
                // }, 5005);
                // const timeInterval = setInterval(() => {
                //     setTimer(prevTimer => prevTimer - 1); // Update timer value
                // }, 1000);
            }
        }
        else if (handleResetPasswordError) {
            const { statusCode, message } = (resetPasswordError as AxiosError<ApiResponse>)?.response?.data ?? {};
            if (statusCode === 401) {
                setError('form', {
                    type: 'form',
                    message: message,
                });
            }
        }
    }, [resetPasswordResponse, resetPasswordError])

    const onSubmit = (data: RestFormData) => {
        resetPasswordMutate(data)
    }

    const handleLogin = () => {
        console.log('login');
    }
    return (
        <>
            {
                !isChanged ? (
                    <div className="resetPass flex flex-col w-full">
                        <div className="w-full border-b-2">
                            <p className='resetPassHeading'>Reset Password </p>
                        </div>
                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col" style={{ rowGap: '20px' }}>
                                    <Controller
                                        name="currentPassword"
                                        control={control}
                                        rules={{ required: 'Current Password is required' }}
                                        render={({ field }: any) => (
                                            <InputWithLabel
                                                label="Current Password"
                                                placeholder="Enter your current password"
                                                register={register}
                                                name="currentPassword"
                                                type="password"
                                                errors={errors}
                                                field={field}
                                                onChange={() => trigger('currentPassword')}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        rules={{ required: 'New Password is required' }}
                                        render={({ field }: any) => (
                                            <InputWithLabel
                                                label="New Password"
                                                placeholder="Enter your new password"
                                                register={register}
                                                name="newPassword"
                                                type="password"
                                                errors={errors}
                                                field={field}
                                                onChange={() => trigger('newPassword')}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="confirmNewPassword"
                                        control={control}
                                        rules={{
                                            required: 'Confirm Password is required',
                                        }}
                                        render={({ field }: any) => (
                                            <InputWithLabel
                                                label="Confirm Password"
                                                placeholder="Confirm your new password"
                                                register={register}
                                                name="confirmNewPassword"
                                                type="password"
                                                errors={errors}
                                                field={field}
                                                onChange={() => trigger('confirmNewPassword')}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="passwordNote mt-4">
                                    *Your password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, , &, ?).
                                </div>
                                {!hasFieldError() && errors.form && <p className="formError">{errors.form.message}</p>}
                                <div className="changeButton mt-5">
                                    <Button
                                        type="submit"
                                        label="Update Password"
                                        disabled={!isValid || (handleResetPasswordStatus && handleResetPasswordStatus ? true : false)}
                                        btnStyle={{
                                            color: '#fff',
                                            backgroundColor: '#f0a400',
                                            minWidth: 'fit-content'
                                        }}
                                    />
                                </div>
                            </div>
                        </form>

                    </div>
                ) : <Verify label={`Redirect to Dashboard`} message='Password changed Successfully' handleClick={() => router.push('/dashboard')} />
            }

        </>
    )
}
