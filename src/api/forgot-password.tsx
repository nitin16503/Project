import { useMutation } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";



export function useForgotPasswordMutation() {
    const api = useAxios();
    const {
        isError: isForgotPasswordError,
        error: forgotPasswordError,
        isSuccess: isForgotPasswordSuccess,
        data: forgotPasswordResponse,
        mutate: forgotPasswordMutate,
    } = useMutation({
        mutationFn: async (email: string) => {
            let response = await api.post('auth/forgot-password', { email });
            return response;
        },
    });
    return {
        isForgotPasswordError,
        forgotPasswordError,
        isForgotPasswordSuccess,
        forgotPasswordResponse,
        forgotPasswordMutate,
    };
}

export function useFpchangeMutation() {
    const api = useAxios();
    const {
        isError: isFpchangeError,
        error: fpchangeError,
        isSuccess: isFpchangeSuccess,
        isPending: FpchangeStatus,
        data: fpchangeResponse,
        mutate: fpchangeMutate,
    } = useMutation({
        mutationFn: async (data: { email: string, password: string, code: string, confirmPassword: string }) => {
            let response = await api.post('auth/reset-password', {...data});
            return response;
        },
    });
    return {
        isFpchangeError,
        fpchangeError,
        isFpchangeSuccess,
        FpchangeStatus,
        fpchangeResponse,
        fpchangeMutate,
    };
}
