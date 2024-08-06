import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";



export function useGetNotifications({page = 1, read = true}) {
    const api = useAxios();
    const { data, error, isLoading, refetch: refetchNotifications, isError, isSuccess } = useQuery({
        queryKey: ["notificationList", page],
        queryFn: async () => {
            const url = read ? `users/activity/notifications` : `users/activity/notifications?read=false`
            let response = await api.get(url);
            return response;
        },
    });
    return {
        notificationsData: data,
        notificationError: error,
        isNotificationSuccess: isSuccess,
        isNotificationError: isError,
        isNotificationsLoading: isLoading,
        refetchNotifications,
    };
}

export function useGetAllNotifications() {
    const api = useAxios();
    const { data, error, isLoading, refetch: refetchallNotifications, isError, isSuccess } = useQuery({
        queryKey: ["notificationList"],
        queryFn: async () => {
            const url = `users/activity/notifications`;
            let response = await api.get(url);
            return response;
        },
    });
    return {
        allnotificationsData: data,
        allnotificationError: error,
        isallNotificationSuccess: isSuccess,
        isallNotificationError: isError,
        isallNotificationsLoading: isLoading,
        refetchallNotifications,
    };
}

export function useGetNotificationCount() {
    const api = useAxios();
    const { data, error, isLoading, refetch: refetchNotificationCount } = useQuery({
        queryKey: ["notificationCount"],
        queryFn: async () => {
            let response = await api.get(`users/activity/notifications/count`);
            return response;
        },
    });
    return {
        notificationCount: data,
        notificationCountError: error,
        isNotificationCountLoading: isLoading,
        refetchNotificationCount,
    };
}

export function useMarkNotificationReadMutation() {
    const api = useAxios();
    const {
        mutate: markNotificationRead,
        isPending: isMarkingNotificationRead,
        isError: markNotificationReadError,
        error: markNotificationReadErrorMessage,
        isSuccess: markNotificationReadSuccess,
        data: markNotificationReadData,
    } = useMutation({
        mutationFn: async (notificationArr: string[]) => {
            const response = await api.post(`users/activity/notifications/read`,{notificationIds: notificationArr});
            return response;
        },
    });

    return {
        markNotificationRead,
        isMarkingNotificationRead,
        markNotificationReadError,
        markNotificationReadErrorMessage,
        markNotificationReadSuccess,
        markNotificationReadData,
    };
}



