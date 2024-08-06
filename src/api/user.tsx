import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import { useMutation } from "@tanstack/react-query";
import { clearStorage, updateUserInfo } from '@/src/utils/helper';
import useAxios from '@/src/hooks/useAxios';
import { LoginForm } from '@/src/utils/types';
import axios from 'axios';
import { BACKEND_URL } from '@/src/utils/config';
import { getUserInfo } from '@/src/utils/helper';
import { SignupForm, changeCenterForm, OTPFormData } from '@/src/utils/types';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { useContext } from 'react';
import { SocketContext, SocketContextType } from '../providers/EventListener';

interface changePasswordForm {
    email: string;
    password: string,
    confirmPassword: string;
    code: string
}

interface verifyCodeForm {
    email: string;
    code: string
}

export function getSignupForm() {
    const api = useAxios();
    const { data: signupForm } = useQuery({
        queryKey: ["signupForm"],
        queryFn: async () => {
            let response = await api.get('auth/signup')
            return response;
        },
    });
    return {
        signupForm
    };
}


export function logoutMutation() {
    const router = useRouter();
    const level = getUserInfo('level');
    const { disconnectSocket } = useContext<SocketContextType>(SocketContext);

    const mutation = useMutation({
        mutationFn: async () => {
            const accessToken = getUserInfo('token');
            let apiURL = `${BACKEND_URL}/users/logout`;
            if (level === 'patient') {
                apiURL = `${BACKEND_URL}/patient/me/logout`;
            }
            const response = await axios.post(apiURL, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response;
        },
    });

    const logoutAndRedirect = async () => {
        try {
            await mutation.mutateAsync();
            disconnectSocket();
            if(level === 'superAdmin'){
                router.push('./admin/login')
            }
            if (level === 'patient') {
                router.push('/signin');
            } else {
                router.push('/login');
            }
            clearStorage();
        } catch (error) {
            const { statusCode, data, message } = (error as AxiosError<ApiResponse>)?.response?.data || {};
            if (statusCode === 401 && message === 'jwt expired') {
                disconnectSocket();
                router.push('/login');
                clearStorage();
            }
        }
    };

    return {
        logout: logoutAndRedirect
    };
}
export function refreshTokenMutation() {
    const api = useAxios();
    const mutation = useMutation({
        mutationFn: async () => {
            let response = await api.post('users/refreshToken')
            return response;
        },
        onSuccess(response, variables, context) {
            const { statusCode, data } = response.data;
            if (statusCode == 200) {
                updateUserInfo('token', data)
            }
        },
        onError(error, variables, context) {
            console.log(error, "error")
        },
    });
    const refresh = async () => {
        try {
            // Execute the refresh mutation
            await mutation.mutateAsync();
            console.log("Refresh token successfully")
        } catch (error) {
            console.error('Refresh token failed', error);
        }
    };
    return {
        refreshAccessToken: refresh,
    };
}

export function loginMutation() {
    const api = useAxios();
    const {
        isError: handleLoginError,
        error: loginError,
        isSuccess: handleLoginSuccess,
        data: loginResponse,
        isPending: loginStatus,
        mutate: loginMutate,
    } = useMutation({
        mutationFn: async (data: LoginForm) => {
            let response = await api.post('auth/login', JSON.stringify(data))
            return response;
        },
    });
    return {
        handleLoginError,
        loginError,
        handleLoginSuccess,
        loginResponse,
        loginStatus,
        loginMutate,
    };
}

export function changePasswordMutation() {
    const api = useAxios();
    const {
        isError: handleChangePasswordError,
        error: changePasswordError,
        isSuccess: handleChangePasswordSuccess,
        isPending: handlechangePasswordStatus,
        data: changePasswordResponse,
        mutate: changePasswordMutate,
    } = useMutation({
        mutationFn: async (data: changePasswordForm) => {
            let response = await api.post('auth/change-password-with-otp', data)
            return response;
        },
    });
    return {
        handleChangePasswordError,
        changePasswordError,
        handleChangePasswordSuccess,
        handlechangePasswordStatus,
        changePasswordResponse,
        changePasswordMutate
    };
}

export function verifyCodeMutation() {
    const api = useAxios();
    const {
        isError: handleVerifyCodeError,
        error: verifyCodeError,
        isSuccess: handleVerifyCodeSuccess,
        data: verifyCodeResponse,
        mutate: verifyCodeMutate,
    } = useMutation({
        mutationFn: async (data: verifyCodeForm) => {
            let response = await api.post('auth/email-otp-verification', data);
            return response;
        },
    });

    return {
        handleVerifyCodeError,
        verifyCodeError,
        handleVerifyCodeSuccess,
        verifyCodeResponse,
        verifyCodeMutate,
    };
}

export function signupMutation() {
    const api = useAxios();
    const {
        isError: isSignupError,
        error: signupError,
        isSuccess: isSignupSuccess,
        data: signupResponse,
        isPending: signUpStatus,
        mutate: signupMutate,
    } = useMutation({
        mutationFn: async (data: SignupForm) => {
            let response = await api.post('auth/signup', data)
            return response;
        },
    });
    return {
        isSignupError,
        signupError,
        isSignupSuccess,
        signUpStatus,
        signupResponse,
        signupMutate,
    };
}

export function verifyOtpMutation() {
    const api = useAxios();
    const {
        isError: isverifyOtpError,
        error: verifyOtpError,
        isSuccess: isverifyOtpSuccess,
        data: verifyOtpResponse,
        mutate: verifyOtpMutate,
    } = useMutation({
        mutationFn: async (data: any) => {
            let response = await api.post('auth/otp/verify', { phoneNo: data.phoneNo, otpCode: data.otpCode })
            return response;
        },
    });
    return {
        isverifyOtpError,
        verifyOtpError,
        isverifyOtpSuccess,
        verifyOtpResponse,
        verifyOtpMutate,
    };
}

export function getOtpMutation() {
    const api = useAxios();
    const {
        isError: handleOtpError,
        error: otpError,
        isSuccess: handleOtpSuccess,
        data: otpResponse,
        mutate: otpMutate,
    } = useMutation({
        mutationFn: async (phoneNo: string) => {
            let response = await api.post('auth/otp', { phoneNo })
            return response;
        },
    });
    return {
        handleOtpError,
        otpError,
        handleOtpSuccess,
        otpResponse,
        otpMutate,
    };
}

export function verifyEmailMutation() {
    const api = useAxios();
    const {
        isError: isverifyEmailError,
        error: verifyEmailError,
        isSuccess: isverifyEmailSuccess,
        data: verifyEmailResponse,
        mutate: verifyEmailMutate,
    } = useMutation({
        mutationFn: async (email: any) => {
            let response = await api.post('auth/validate-email', { email: email })
            return response;
        },
    });
    return {
        isverifyEmailError,
        verifyEmailError,
        isverifyEmailSuccess,
        verifyEmailResponse,
        verifyEmailMutate
    };
}

export function centerMutation() {
    const api = useAxios();
    const {
        isError,
        error: errorResponse,
        isSuccess,
        data: responseData,
        mutate: changeActiveCenterMutate,
    } = useMutation({
        mutationFn: async (data: changeCenterForm) => {
            let response = await api.patch('users/me/change-active-center', JSON.stringify(data))
            return response;
        },
    });
    return {
        isError,
        errorResponse,
        isSuccess,
        responseData,
        changeActiveCenterMutate,
    };
}

export function otpLoginMutation() {
    const api = useAxios();
    const {
        isError: handleLoginError,
        error: loginError,
        isSuccess: handleLoginSuccess,
        data: loginResponse,
        isPending: loginStatus,
        mutate: loginMutate,
    } = useMutation({
        mutationFn: async (data: OTPFormData) => {
            let response = await api.post('patient/auth/login', JSON.stringify(data))
            return response;
        },
    });
    return {
        handleLoginError,
        loginError,
        handleLoginSuccess,
        loginResponse,
        loginStatus,
        loginMutate,
    };
}