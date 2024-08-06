import useAxios from "../hooks/useAxios";
import { useMutation, useQuery } from '@tanstack/react-query'

export function getTestList({ page = 1, limit = 10, sortBy = 'status', sortOrder = 'asc', patientName = '', scanStartDate = '', scanEndDate = '' }) {
    const api = useAxios();
    const { data: testList, error: errorTestList, isError: isErrorTestList, isLoading: isLoadingTestList, isSuccess: isSuccessTestList, refetch: refetchAllTests } = useQuery({
        queryKey: ["testlist", page],
        queryFn: async () => {
            let response = await api.get(`scanTests?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&patientName=${patientName}&scanStartDate=${scanStartDate}&scanEndDate=${scanEndDate}`);
            return response;
        },
        enabled: false
    });
    return {
        testList,
        errorTestList,
        isErrorTestList,
        isLoadingTestList,
        isSuccessTestList,
        refetchAllTests
    };
}

export function downloadScanTest({ page = 1, limit = 10, sortBy = 'status', sortOrder = 'asc', patientName = '', scanStartDate = '', scanEndDate = '' }) {
    const api = useAxios();
    const {
        isError: isErrordownloadTest,
        error: errordownloadTest,
        isSuccess: isSuccessdownloadTest,
        data: responsedownloadTest,
        isPending: statusdownloadTest,
        mutate: downloadTestMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`scanTests/download-scan-tests?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&patientName=${patientName}&scanStartDate=${scanStartDate}&scanEndDate=${scanEndDate}`)
            return response
        },
    });
    return {
        isErrordownloadTest,
        errordownloadTest,
        isSuccessdownloadTest,
        responsedownloadTest,
        statusdownloadTest,
        downloadTestMutate,
    };
}

export function getPatientTestsById({ patientId = '', page = 1, limit = 500, sortBy = 'status', sortOrder = 'asc' }) {
    const api = useAxios();
    const { data: testDetail, error: errorTestDetail, isLoading: loadingTestDetail, isSuccess: isSuccessTestDetail, isError: isErrorTestDetail, refetch: refetchAllTests } = useQuery({
        queryKey: ["Tests", patientId],
        queryFn: async () => {
            let response = await api.get(`scanTests?patientId=${patientId}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            return response;
        },
        enabled: false
    });
    return {
        testDetail,
        errorTestDetail,
        loadingTestDetail,
        isSuccessTestDetail,
        isErrorTestDetail,
        refetchAllTests
    };
}

export function getPatientTests() {
    const api = useAxios();
    const { data: testList, error: errorTestList, isLoading: loadingTestDetail, isSuccess: isSuccessTestDetail, isError: isErrorTestList } = useQuery({
        queryKey: ["patientTests"],
        queryFn: async () => {
            let response = await api.get(`patient/me/scanTests`);
            return response;
        },
    });
    return {
        testList,
        errorTestList,
        loadingTestDetail,
        isSuccessTestDetail,
        isErrorTestList
    };
}

export function syncReportMutation() {
    const api = useAxios();
    const {
        isError: isError,
        error: error,
        isSuccess: isSuccess,
        data: response,
        isPending: status,
        mutate: syncMutate,
    } = useMutation({
        mutationFn: async () => {
            let response = await api.get(`scanTests/updatePacsData`)
            return response
        },
    });
    return {
        isError,
        error,
        isSuccess,
        response,
        status,
        syncMutate,
    };
}

export function getScanTestDetail({ scanTestId='' }) {
    const api = useAxios();
    const { data: scanTestDetail, error: error, isError: isError, isLoading: isLoading, isSuccess: isSuccess, refetch: refetchDetail } = useQuery({
        queryKey: ["scanTestDetail", scanTestId],
        queryFn: async () => {
            let response = await api.get(`scanTests/${scanTestId}`);
            return response;
        },
    });
    return {
        scanTestDetail, 
        error, 
        isError, 
        isLoading, 
        isSuccess, 
        refetchDetail
    };
}