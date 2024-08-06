import useAxios from "../hooks/useAxios";
import { useMutation, useQuery } from '@tanstack/react-query'
import { assignReviewerMutationType, ReviewAnnotationObject } from "../utils/types";

export function getAllRadiologist() {
    const api = useAxios();
    const { data: response, isSuccess , isLoading} = useQuery({
        queryKey: ["RadiologistList"],
        queryFn: async () => {
            let response = await api.get('scanReports/reports/reviewers');
            return response;
        },
        //enabled:false
    });
    return {
        isLoading,
        response,
        isSuccess,
    };
}

export function assignReviewerMutation() {
    const api = useAxios();
    const {
        isError: isAssignReviewerError,
        error: assignReviewerError,
        isPending: assignReviewerStatus,
        isSuccess: isAssignReviewerSuccess,
        data: assignReviewerResponse,
        mutate: assignReviewerMutate,
    } = useMutation({
        mutationFn: async (data: assignReviewerMutationType) => {
            let response = await api.post(`scanReports/${data.scanReportId}/assign-reviewer`, { reviewerId: data.reviewerId });
            return response.data;
        },
    });
    return {
        isAssignReviewerError,
        assignReviewerStatus,
        assignReviewerError,
        isAssignReviewerSuccess,
        assignReviewerResponse,
        assignReviewerMutate,
    };
}

export function reviewAnnotation() {
    const api = useAxios();
    const {
        isError: isErrorReviewAnnotation,
        error: errorReviewAnnotation,
        isSuccess: isSuccessReviewAnnotation,
        data: responseReviewAnnotation,
        isPending: statusReviewAnnotation,
        mutate: reviewAnnotationMutate,
    } = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: ReviewAnnotationObject }) => {
            let response = await api.patch(`scanReports/${id}`, data)
            return response
        },
    });
    return {
        isErrorReviewAnnotation,
        errorReviewAnnotation,
        isSuccessReviewAnnotation,
        responseReviewAnnotation,
        statusReviewAnnotation,
        reviewAnnotationMutate,
    };
}

export function publishReport() {
    const api = useAxios();
    const {
        isError: isErrorPublish,
        error: errorPublish,
        isSuccess: isSuccessPublish,
        data: responsePublish,
        isPending: statusPublish,
        mutate: publishMutate,
    } = useMutation({
        mutationFn: async ({ id }: { id: string;}) => {
            let response = await api.post(`scanReports/${id}/publish`)
            return response
        },
    });
    return {
        isErrorPublish,
        errorPublish,
        isSuccessPublish,
        responsePublish,
        statusPublish,
        publishMutate,
    };
}

export function assignReportToMe() {
    const api = useAxios();
    const {
        isError: isErrorAssign,
        error: errorAssign,
        isSuccess: isSuccessAssign,
        data: responseAssign,
        isPending: statusAssign,
        mutate: assignMutate,
    } = useMutation({
        mutationFn: async (id:string) => {
            let response = await api.post(`scanReports/${id}/pick`)
            return response
        },
    });
    return {
        isErrorAssign,
        errorAssign,
        isSuccessAssign,
        responseAssign,
        statusAssign,
        assignMutate,
    };
}

export function useDownloadReport() {
    const api = useAxios();
    const {
        isError: isErrorDownload,
        error: errorDownload,
        isSuccess: isSuccessDownload,
        data: downloadData,
        isPending: isLoadingDownload,
        mutate: download,
    } = useMutation({
        mutationFn: async (id:string) => {
            let response = await api.get(`scanReports/${id}/download-final-report`, { responseType: 'blob' });
            return response
        },
    });
    return {
        downloadData, 
        errorDownload, 
        isErrorDownload, 
        isLoadingDownload, 
        isSuccessDownload, 
        download
    };
}

export function saveAsDraft() {
    const api = useAxios();
    const {
        isError: isErrorSaveAsDraft,
        error: errorSaveAsDraft,
        isSuccess: isSuccessSaveAsDraft,
        data: responseSaveAsDraft,
        isPending: statusSaveAsDraft,
        mutate: saveAsDraftMutate,
    } = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            let response = await api.post(`scanReports/${id}/save-as-draft`,data)
            return response
        },
    });
    return {
        isErrorSaveAsDraft,
        errorSaveAsDraft,
        isSuccessSaveAsDraft,
        responseSaveAsDraft,
        statusSaveAsDraft,
        saveAsDraftMutate,
    };
}
