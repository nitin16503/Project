import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { RestFormData, addUserFormData, editUserFormData } from "../utils/types";

export const addUsers = async (data: addUserFormData) => {
    const api = useAxios()
    let response = await api.post('users', data)
    return response
};

export function addUsersMutation() {
    const api = useAxios();
    const {
        isError: isAddUserError,
        error: addUserError,
        isSuccess: isAddUserSuccess,
        data: addUserResponse,
        isPending: addUserStatus,
        mutate: addUserMutate,
    } = useMutation({
        mutationFn: async (data: addUserFormData) => {
            let response = await api.post('users', data)
            return response
        },
    });
    return {
        isAddUserError,
        addUserError,
        isAddUserSuccess,
        addUserStatus,
        addUserResponse,
        addUserMutate,
    };
}

export function resetPasswordMutation() {
    const api = useAxios();
    const {
        isError: handleResetPasswordError,
        error: resetPasswordError,
        isSuccess: handleResetPasswordSuccess,
        isPending: handleResetPasswordStatus,
        data: resetPasswordResponse,
        mutate: resetPasswordMutate,
    } = useMutation({
        mutationFn: async (data: RestFormData) => {
            let response = await api.patch('users/me/change-password', data); // Adjusted endpoint
            return response;
        },
    });
    return {
        handleResetPasswordError,
        resetPasswordError,
        handleResetPasswordSuccess,
        handleResetPasswordStatus,
        resetPasswordResponse,
        resetPasswordMutate
    };
}


export function editUserMutation() {
    const api = useAxios();
    const {
        isError: isAddUserError,
        error: addUserError,
        isSuccess: isAddUserSuccess,
        data: addUserResponse,
        isPending: editUserStatus,
        mutate: editUserMutate,
    } = useMutation({
        mutationFn: async (data: editUserFormData) => {
            let response = await api.patch(`users/${data?.id}`, data)
            return response
        },
    });
    return {
        isAddUserError,
        addUserError,
        isAddUserSuccess,
        editUserStatus,
        addUserResponse,
        editUserMutate,
    };
}

export function getUserMutation() {
    const api = useAxios();
    const {
        isError: isGetUserError,
        error: getUserError,
        isPending: getUserStatus,
        isSuccess: isGetUserSuccess,
        data: getUserResponse,
        mutate: getUserMutate,
    } = useMutation({
        mutationFn: async (id: string) => {
            let response = await api.get(`users/${id}`)
            return response
        },
    });
    return {
        isGetUserError,
        getUserStatus,
        getUserError,
        isGetUserSuccess,
        getUserResponse,
        getUserMutate,
    };
}

export function deleteUserMutation() {
    const api = useAxios();
    const {
        isError: isDeleteUserError,
        error: deleteUserError,
        isSuccess: isDeleteUserSuccess,
        data: deleteUserResponse,
        mutate: deleteUserMutate,
    } = useMutation({
        mutationFn: async (id: string) => {
            let response = await api.delete(`users/${id}`)
            return response
        },
    });
    return {
        isDeleteUserError,
        deleteUserError,
        isDeleteUserSuccess,
        deleteUserResponse,
        deleteUserMutate,
    };
};

export function usegetAllUsers(page = 1) {
    const api = useAxios();
    const { data, error, isLoading, refetch: refetchUsers } = useQuery({
        queryKey: ["userList", page],
        queryFn: async () => {
            let response = await api.get(`users?limit=10&page=${page}`);
            return response;
        },
    });
    return {
        data,
        error,
        isLoading,
        refetchUsers
    };
}

export function searchUsers(searchString: string) {
    const api = useAxios();
    const { data: searchResult, error: searchError, isLoading: searchLoading, isSuccess: searchSuccess, refetch: refetchSearch } = useQuery({
        queryKey: ["searchedUserList", searchString],
        queryFn: async () => {
            let response = await api.get(`users?search=${searchString}`);
            return response;
        },
    });
    return {
        searchResult,
        searchError,
        searchLoading,
        searchSuccess,
        refetchSearch
    };
}

export function getGlobalSearch({ page = 1, search = '', sortBy = '', sortOrder = 'asc' }) {
    const api = useAxios();
    const { data: searchResults, error: errorGlobalSearch, isError: isErrorGlobalSearch, isLoading: isGlobalSearchLoading, isSuccess: isGlobalSearchSuccess, refetch: refetchGlobalSearch } = useQuery({
        queryKey: ["globalSearch", page, search],
        queryFn: async () => {
            let response = await api.get(`globalSearch?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`);
            return response;
        },
    });

    return {
        searchResults,
        errorGlobalSearch,
        isGlobalSearchLoading,
        isErrorGlobalSearch,
        isGlobalSearchSuccess,
        refetchGlobalSearch
    };
}
