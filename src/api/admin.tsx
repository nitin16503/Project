import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import { useMutation } from "@tanstack/react-query";
import useAxios from '../hooks/useAxios';
import { LoginForm } from '../utils/types';

export function adminLoginMutation() {
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
            let response = await api.post('admin/auth/login', JSON.stringify(data))
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

export function useCreateReportTemplate() {
    const api = useAxios();

    const {
        isError: createReportTemplateError,
        error: createReportTemplateErrorObject,
        data: createReportTemplateResponse,
        isSuccess: createReportTemplateSuccess,
        mutate: createReportTemplateMutation,
    } = useMutation({
        mutationFn: async (reportTemplateData: any) => {
            const response = await api.post('admin/report-templates', reportTemplateData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        createReportTemplateError,
        createReportTemplateErrorObject,
        createReportTemplateSuccess,
        createReportTemplateResponse,
        createReportTemplateMutation,
    };
}


export function getUserAdmin({search='',page=1,limit=10,sortBy='', sortOrder=''}) {
    const api = useAxios();
    const {
        isError: handleUserError,
        error: userError,
        isSuccess: handleUserSuccess,
        data: userResponse,
        isPending: userStatus,
        mutate: userMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/users?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleUserError,
        userError,
        handleUserSuccess,
        userResponse,
        userStatus,
        userMutate,
    };
}

export function toActivateUser({userId='', type=''}) {
    const api = useAxios();
    const {
        isError: handleActivationError,
        error: activationError,
        isSuccess: handleActivationSuccess,
        mutate: activationMutate,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.post(`admin/users/${userId}/${type}`);
            return response;
        },
    });

    return {
        handleActivationError,
        activationError,
        handleActivationSuccess,
        activationMutate,
    };
}


export function getTestimonials({ search = '', page = 1, limit = 10, sortBy = '', sortOrder = '' }) {
    const api = useAxios();
    const {
        isError: handleTestimonialsError,
        error: testimonialsError,
        isSuccess: handleTestimonialsSuccess,
        data: testimonialsResponse,
        isPending: testimonialsStatus,
        mutate: testimonialsMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/testimonials?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleTestimonialsError,
        testimonialsError,
        handleTestimonialsSuccess,
        testimonialsResponse,
        testimonialsStatus,
        testimonialsMutate,
    };
}

export function getHealthcare({ search = '', page = 1, limit = 10, sortBy = '', sortOrder = '' }) {
    const api = useAxios();
    const {
        isError: handleHealthcareError,
        error: healthcareError,
        isSuccess: handleHealthcareSuccess,
        data: healthcareResponse,
        isPending: healthcareStatus,
        mutate: healthcareMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/healthcarefacilites?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleHealthcareError,
        healthcareError,
        handleHealthcareSuccess,
        healthcareResponse,
        healthcareStatus,
        healthcareMutate,
    };
}

export function getCentersList({ search = '', page = 1, limit = 10, sortBy = '', sortOrder = '' }) {
    const api = useAxios();
    const {
        isError: handleCentersError,
        error: centersError,
        isSuccess: handleCentersSuccess,
        data: centersResponse,
        isPending: centersStatus,
        mutate: centersMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/centers?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleCentersError,
        centersError,
        handleCentersSuccess,
        centersResponse,
        centersStatus,
        centersMutate,
    };
}

export function deleteCenter(centerId: string) {
    const api = useAxios();
    const {
        isError: handleDeleteError,
        error: deleteError,
        isSuccess: handleDeleteSuccess,
        mutate: deleteMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/centers/${centerId}`);
            return response;
        },
    });

    return {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteMutation,
    };
}

export function deleteModalitites(modality: string) {
    const api = useAxios();
    const {
        isError: handleDeleteError,
        error: deleteError,
        isSuccess: handleDeleteSuccess,
        mutate: deleteMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/modalities/${modality}`);
            return response;
        },
    });

    return {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteMutation,
    };
}

export function deleteReportTemplate(templateId: string) {
    const api = useAxios();
    const {
        isError: handleDeleteError,
        error: deleteError,
        isSuccess: handleDeleteSuccess,
        mutate: deleteMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/report-templates/${templateId}`);
            return response;
        },
    });

    return {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteMutation,
    };
}


export function getModalityList({ search = '', page = 1, limit = 10, sortBy = '', sortOrder = '' }) {
    const api = useAxios();
    const {
        isError: handleModalityError,
        error: modalityError,
        isSuccess: handleModalitySuccess,
        data: modalityResponse,
        isPending: modalityStatus,
        mutate: modalityMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/modalities?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleModalityError,
        modalityError,
        handleModalitySuccess,
        modalityResponse,
        modalityStatus,
        modalityMutate,
    };
}

export function getReportTemplateList({ search = '', page = 1, limit = 10, sortBy = '', sortOrder = '' }) {
    const api = useAxios();
    const {
        isError: handleReportTemplateError,
        error: reportTemplateError,
        isSuccess: handleReportTemplateSuccess,
        data: reportTemplateResponse,
        isPending: reportTemplateStatus,
        mutate: reportTemplateMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`admin/report-templates?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
    });
    return {
        handleReportTemplateError,
        reportTemplateError,
        handleReportTemplateSuccess,
        reportTemplateResponse,
        reportTemplateStatus,
        reportTemplateMutate,
    };
}


export function deleteTestimonial(id: string) {
    const api = useAxios();
    const {
        isError: handleDeleteError,
        error: deleteError,
        data: deletResponse,
        isSuccess: handleDeleteSuccess,
        mutate: deleteMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/testimonials/${id}`);
            return response;
        },

    });

    return {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deletResponse,
        deleteMutation,
    };
}

export function useActivateUser({id ='', type='activate'}) {
    const api = useAxios();

    const {
        isError: activateUserError,
        error: activateUserErrorObject,
        data: activateResponse,
        isSuccess: activateUserSuccess,
        mutate: activateUserMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.post(`admin/users/${id}/actions/${type}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        activateUserError,
        activateUserErrorObject,
        activateUserSuccess,
        activateResponse,
        activateUserMutation,
    };
}

export function useDeleteUser(id='') {
    const api = useAxios();

    const {
        isError: deleteUserError,
        error: deleteUserErrorObject,
        isSuccess: deleteUserSuccess,
        data: deleteUserResponse,
        mutate: deleteUserMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/users/${id}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        deleteUserError,
        deleteUserErrorObject,
        deleteUserSuccess,
        deleteUserMutation,
        deleteUserResponse
    };
}

export function useCreateTestimonial() {
    const api = useAxios();

    const {
        isError: createTestimonialError,
        error: createTestimonialErrorObject,
        data: createTestimonialResponse,
        isSuccess: createTestimonialSuccess,
        mutate: createTestimonialMutation,
    } = useMutation({
        mutationFn: async (testimonialData: any) => {

            const response = await api.post('admin/testimonials', testimonialData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        createTestimonialError,
        createTestimonialErrorObject,
        createTestimonialSuccess,
        createTestimonialResponse,
        createTestimonialMutation,
    };
}

export function useCreateModality() {
    const api = useAxios();

    const {
        isError: createModalityError,
        error: createModalityErrorObject,
        data: createModalityResponse,
        isSuccess: createModalitySuccess,
        mutate: createModalityMutation,
    } = useMutation({
        mutationFn: async (modalityData: any) => {
            const response = await api.post('admin/modalities', modalityData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        createModalityError,
        createModalityErrorObject,
        createModalitySuccess,
        createModalityResponse,
        createModalityMutation,
    };
}

export function useCreateHealthcareFacility() {
    const api = useAxios();

    const {
        isError: createHealthcareFacilityError,
        error: createHealthcareFacilityErrorObject,
        data: createHealthcareFacilityResponse,
        isSuccess: createHealthcareFacilitySuccess,
        mutate: createHealthcareFacilityMutation,
    } = useMutation({
        mutationFn: async (healthcareFacilityData: any) => {
            const response = await api.post('admin/healthcarefacilites', healthcareFacilityData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        createHealthcareFacilityError,
        createHealthcareFacilityErrorObject,
        createHealthcareFacilitySuccess,
        createHealthcareFacilityResponse,
        createHealthcareFacilityMutation,
    };
}

export function deleteHealthcareFacility(id: string) {
    const api = useAxios();
    const {
        isError: handleDeleteError,
        error: deleteError,
        data: deleteResponse,
        isSuccess: handleDeleteSuccess,
        mutate: deleteMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`admin/healthcarefacilites/${id}`);
            return response;
        },

    });

    return {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteResponse,
        deleteMutation,
    };
}

export function useCreateCenter() {
    const api = useAxios();

    const {
        isError: createCenterError,
        error: createCenterErrorObject,
        data: createCenterResponse,
        isSuccess: createCenterSuccess,
        mutate: createCenterMutation,
    } = useMutation({
        mutationFn: async (centerData: any) => {
            const response = await api.post('admin/centers', centerData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        createCenterError,
        createCenterErrorObject,
        createCenterSuccess,
        createCenterResponse,
        createCenterMutation,
    };
}

export function useEditModality() {
    const api = useAxios();

    const {
        isError: editModalityError,
        error: editModalityErrorObject,
        data: editModalityResponse,
        isSuccess: editModalitySuccess,
        mutate: editModalityMutation,
    } = useMutation({
        mutationFn: async (modalityData: any) => {
            const { id, ...restData } = modalityData;
            const response = await api.patch(`admin/modalities/${id}`, restData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        editModalityError,
        editModalityErrorObject,
        editModalitySuccess,
        editModalityResponse,
        editModalityMutation,
    };
}

export function useGetModalityById(modalityId: string) {
    const api = useAxios();

    const {
        data: modalityData,
        error: modalityError,
        isLoading: modalityLoading,
        isSuccess: modalitySuccess,
        isError: ismodalityError,
    } = useQuery({
        queryKey: ['modality', modalityId],
        queryFn: async () => {
            const response = await api.get(`admin/modalities/${modalityId}`);
            return response.data;
        },
        enabled: !!modalityId,
    });

    return {
        modalityData,
        modalityError,
        modalityLoading,
        modalitySuccess,
        ismodalityError,
    };
}

export function useEditHealthcareFacility() {
    const api = useAxios();

    const {
        isError: editHealthcareFacilityError,
        error: editHealthcareFacilityErrorObject,
        data: editHealthcareFacilityResponse,
        isSuccess: editHealthcareFacilitySuccess,
        mutate: editHealthcareFacilityMutation,
    } = useMutation({
        mutationFn: async (healthcareFacilityData: any) => {
            const { id, ...restData } = healthcareFacilityData;
            const response = await api.patch(`admin/healthcarefacilites/${id}`, restData);
            return response.data; // Assuming response contains data
        },
    });

    return {
        editHealthcareFacilityError,
        editHealthcareFacilityErrorObject,
        editHealthcareFacilitySuccess,
        editHealthcareFacilityResponse,
        editHealthcareFacilityMutation,
    };
}

export function useGetHealthcareFacilityById(id: string) {
    const api = useAxios();

    const {
        isError: getHealthcareFacilityByIdError,
        error: getHealthcareFacilityByIdErrorObject,
        data: getHealthcareFacilityByIdResponse,
        isSuccess: getHealthcareFacilityByIdSuccess,
        mutate: getHealthcareFacilityByIdMutation,
    } = useMutation({
        mutationFn: async () => {
            const response = await api.get(`admin/healthcarefacilites/${id}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        getHealthcareFacilityByIdError,
        getHealthcareFacilityByIdErrorObject,
        getHealthcareFacilityByIdSuccess,
        getHealthcareFacilityByIdResponse,
        getHealthcareFacilityByIdMutation,
    };
}

export function useGetReportTemplateByID() {
    const api = useAxios();

    const {
        isError: getReportTemplateByIdError,
        error: getReportTemplateByIdErrorObject,
        data: getReportTemplateByIdResponse,
        isSuccess: getReportTemplateByIdSuccess,
        mutate: getReportTemplateByIdMutation,
    } = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.get(`admin/report-templates/${id}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        getReportTemplateByIdError,
        getReportTemplateByIdErrorObject,
        getReportTemplateByIdSuccess,
        getReportTemplateByIdResponse,
        getReportTemplateByIdMutation,
    };
}

export function useUpdateReportTemplateByID() {
    const api = useAxios();

    const {
        isError: updateReportTemplateByIDError,
        error: updateReportTemplateByIDErrorObject,
        data: updateReportTemplateByIDResponse,
        isSuccess: updateReportTemplateByIDSuccess,
        mutate: updateReportTemplateByIDMutation,
    } = useMutation({
        mutationFn: async (reportData: any) => {
            const { id, data } = reportData;
            const response = await api.patch(`admin/report-templates/${id}`, data);
            return response.data; // Assuming response contains data
        },
    });

    return {
        updateReportTemplateByIDError,
        updateReportTemplateByIDErrorObject,
        updateReportTemplateByIDSuccess,
        updateReportTemplateByIDResponse,
        updateReportTemplateByIDMutation,
    };
}

export function useCreateUser() {
    const api = useAxios();

    const {
        isError: createUserError,
        error: createUserErrorObject,
        data: createUserResponse,
        isSuccess: createUserSuccess,
        mutate: createUserMutation,
    } = useMutation({
        mutationFn: async (userData: any) => {
            const response = await api.post('admin/users', userData); 
            return response.data; 
        },
    });

    return {
        createUserError,
        createUserErrorObject,
        createUserSuccess,
        createUserResponse,
        createUserMutation,
    };
}

export function useGetUserById() {
    const api = useAxios();

    const {
        isError: getUserByIdError,
        error: getUserByIdErrorObject,
        data: getUserByIdResponse,
        isSuccess: getUserByIdSuccess,
        mutate: getUserByIdMutation,
    } = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.get(`admin/users/${id}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        getUserByIdError,
        getUserByIdErrorObject,
        getUserByIdSuccess,
        getUserByIdResponse,
        getUserByIdMutation,
    };
}

export function useUpdateUserById() {
    const api = useAxios();

    const {
        isError: updateUserByIdError,
        error: updateUserByIdErrorObject,
        data: updateUserByIdResponse,
        isSuccess: updateUserByIdSuccess,
        mutate: updateUserByIdMutation,
    } = useMutation({
        mutationFn: async (userData: any) => {
            const { id, centerId } = userData;
            const response = await api.put(`admin/users/${id}/centers`, {centerId});
            return response.data; // Assuming response contains data
        },
    });

    return {
        updateUserByIdError,
        updateUserByIdErrorObject,
        updateUserByIdSuccess,
        updateUserByIdResponse,
        updateUserByIdMutation,
    };
}

export function useGetTestimonialById() {
    const api = useAxios();

    const {
        isError: getTestimonialByIdError,
        error: getTestimonialByIdErrorObject,
        data: getTestimonialByIdResponse,
        isSuccess: getTestimonialByIdSuccess,
        mutate: getTestimonialByIdMutation,
    } = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.get(`admin/testimonials/${id}`);
            return response.data; // Assuming response contains data
        },
    });

    return {
        getTestimonialByIdError,
        getTestimonialByIdErrorObject,
        getTestimonialByIdSuccess,
        getTestimonialByIdResponse,
        getTestimonialByIdMutation,
    };
}

export function useUpdateTestimonialById() {
    const api = useAxios();

    const {
        isError: updateTestimonialByIdError,
        error: updateTestimonialByIdErrorObject,
        data: updateTestimonialByIdResponse,
        isSuccess: updateTestimonialByIdSuccess,
        mutate: updateTestimonialByIdMutation,
    } = useMutation({
        mutationFn: async (testimonialData: any) => {
            const { id, data } = testimonialData;
            const response = await api.patch(`admin/testimonials/${id}`, data);
            return response.data; // Assuming response contains data
        },
    });

    return {
        updateTestimonialByIdError,
        updateTestimonialByIdErrorObject,
        updateTestimonialByIdSuccess,
        updateTestimonialByIdResponse,
        updateTestimonialByIdMutation,
    };
}

