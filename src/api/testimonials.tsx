import useAxios from "../hooks/useAxios";
import { useQuery } from '@tanstack/react-query'

export function getTestimonials() {
    const api = useAxios();
    const { data: response, isSuccess , isLoading} = useQuery({
        queryKey: ["testimonialList"],
        queryFn: async () => {
            let response = await api.get('pub/testimonials');
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