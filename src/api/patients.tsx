import useAxios from "../hooks/useAxios";
import { useQuery, useMutation } from '@tanstack/react-query'
import { AddPatientForm } from "../utils/types";
import { AxiosResponse } from 'axios';

export function getPatientByNumber(phoneNumber: string) {
    const api = useAxios();
    const { data: patientDetail, error: errorPatientDetail, isLoading: loadingPatientDetail, isSuccess: successPatientDetail, isError: isErrorPatientDetail, refetch: getPatient } = useQuery({
        queryKey: ["patient", phoneNumber],
        queryFn: async () => {
            let response = await api.get(`patients/patient?phoneNo=${phoneNumber}`);
            return response;
        },
        enabled: false
    });
    return {
        isErrorPatientDetail,
        patientDetail,
        errorPatientDetail,
        loadingPatientDetail,
        successPatientDetail,
        getPatient
    };
}

export function getPatients({ page = 1, search = '' }) {
    const api = useAxios();
    const { data: patientsList, error: errorPatients, isError: isErrorPatients, isLoading: isPatientListLoaded, isSuccess: isSuccessPatients, refetch: refetchAllPatients } = useQuery({
        queryKey: ["patients", page],
        queryFn: async () => {
            let response = await api.get(`patients?search=${search}&limit=10&page=${page}`);
            return response;
        },

    });

    return {
        patientsList,
        errorPatients,
        isPatientListLoaded,
        isErrorPatients,
        isSuccessPatients,
        refetchAllPatients
    };
}

export function deletePatientMutation() {
    const api = useAxios();
    const {
        isError: isDeletePatientError,
        error: deletePatientError,
        isSuccess: isDeletePatientSuccess,
        data: deletePatientResponse,
        mutate: deletePatientMutate,
    } = useMutation({
        mutationFn: async (patientId: string) => {
            let response = await api.delete(`patients/patient/${patientId}`)
            return response
        },
    });
    return {
        isDeletePatientError,
        deletePatientError,
        isDeletePatientSuccess,
        deletePatientResponse,
        deletePatientMutate,
    };
};

export function addPatientMutation() {
    const api = useAxios();
    const {
        isError: isErrorAddPatient,
        error: errorAddPatient,
        isSuccess: isSuccessAddPatient,
        data: responseAddPatient,
        isPending: statusAddPatient,
        mutate: addPatientMutate,
    } = useMutation({
        mutationFn: async (data: AddPatientForm) => {
            let response = await api.post('patients/patient', data)
            return response
        },
    });
    return {
        isErrorAddPatient,
        errorAddPatient,
        isSuccessAddPatient,
        responseAddPatient,
        statusAddPatient,
        addPatientMutate,
    };
}

export function getPatientById(id: string) {
    const api = useAxios();
    const { data: patientDetail, error: errorPatientDetail, isLoading: loadingPatientDetail, isSuccess: successPatientDetail } = useQuery({
        queryKey: ["patient", id],
        queryFn: async () => {
            let response = await api.get(`patients/patient/${id}`);
            return response;
        },
    });
    return {
        patientDetail,
        errorPatientDetail,
        loadingPatientDetail,
        successPatientDetail,
    };
}

export function editPatientMutation() {
    const api = useAxios();
    const {
        isError: isErrorEditPatient,
        error: errorEditPatient,
        isSuccess: isSuccessEditPatient,
        data: responseEditPatient,
        isPending: statusEditPatient,
        mutate: editPatientMutate,
    } = useMutation<AxiosResponse<any, any>, Error, [string, AddPatientForm]>({
        mutationFn: async ([id, data]) => {
            let response = await api.patch(`patients/patient/${id}`, data)
            return response
        },
    });
    return {
        isErrorEditPatient,
        errorEditPatient,
        isSuccessEditPatient,
        responseEditPatient,
        statusEditPatient,
        editPatientMutate,
    };
}

export function getScanTests() {
    const api = useAxios();
    const { data: scanlist, error: errorScanList, isLoading: loadingScanList, isSuccess: successScanList } = useQuery({
        queryKey: ["scanlist"],
        queryFn: async () => {
            let response = await api.get(`scanTests/allTests`);
            return response;
        },
    });
    return {
        scanlist,
        errorScanList,
        loadingScanList,
        successScanList
    };
}

export function addScanMutation() {
    const api = useAxios();
    const {
        isError: isErrorAddScan,
        error: errorAddScan,
        isSuccess: isSuccessAddScan,
        data: responseAddScan,
        isPending: statusAddScan,
        mutate: addScanMutate,
    } = useMutation({
        mutationFn: async (data: AddPatientForm) => {
            let response = await api.post('scanTests/scanTest', data)
            return response
        },
    });
    return {
        isErrorAddScan,
        errorAddScan,
        isSuccessAddScan,
        responseAddScan,
        statusAddScan,
        addScanMutate
    };
}