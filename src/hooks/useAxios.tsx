'use client'
import { useMemo } from "react";
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "../utils/config";
import { getUserInfo } from "../utils/helper";
import { clearStorage } from "../utils/helper";
import { useRouter } from "next/navigation";

const useAxios = (): AxiosInstance => {
    const authToken = getUserInfo('token');
    const router = useRouter();

    const axiosInstance: AxiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: BACKEND_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        instance.interceptors.request.use(
            async (request: InternalAxiosRequestConfig) => {
                if (!authToken) {
                    return request;
                }
                request.headers.Authorization = `Bearer ${authToken}`;
                if(request.method == 'post' && request.url == 'scanTests/scanTest')
                {
                    request.headers['Content-Type'] = 'multipart/form-data';
                }
                if(request.method == 'post' && request.url == 'admin/testimonials')
                {
                    request.headers['Content-Type'] = 'multipart/form-data';
                }
                if(request.method == 'patch' && request.url?.startsWith('admin/testimonials/'))
                {
                    request.headers['Content-Type'] = 'multipart/form-data';
                }
                console.log(request,'file request ');
                
                return request;
            },
            (error: any) => {
                // Handle request error
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            async (response: AxiosResponse) => {
                return response;
            },
            (error: any) => {
                if (error.response && error.response.data.statusCode === 401 && error.response.data.message === 'jwt expired') {
                    // Call disconnectSocket function after successful logout
                    //disconnectSocket();
                    // Perform logout action 
                    router.push('/login');
                    clearStorage();
                }
                // else if (error.response && error.response.data.statusCode === 401 && error.response.data.message === 'Authorization Error: Not allowed to perform this type of action.')   {
                //     router.push('/_error');
                // }
                // Handle response error
                return Promise.reject(error);
            }
        );

        return instance;
    }, [authToken, router]);

    return axiosInstance;
}

export default useAxios;
