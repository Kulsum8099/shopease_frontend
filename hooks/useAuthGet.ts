import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "@/helpers/axios/axiosInstance";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

export const useAuthGet = <T>(
    endpoint: string,
    queryKey: string[],
    enabled: boolean = true,
    config?: AxiosRequestConfig,
): UseQueryResult<T, AxiosError> => {
    const cookies = useCookies();
    const router = useRouter();

    return useQuery<T, AxiosError>({
        queryKey,
        queryFn: async () => {
            const token = cookies.get('accessToken');

            if (!token) {
                toast.error("Authentication required");
                router.push('/login');
                throw new Error('Authentication required');
            }

            try {
                const response = await axiosInstance.get<T>(endpoint, {
                    ...config,
                    headers: {
                        ...config?.headers,
                        Authorization: `Bearer ${token}`
                    }
                });
                return response?.data;
            } catch (error) {
                const err = error as AxiosError;

                if (err.response?.status === 401) {
                    toast.error("Session expired. Please login again.");
                    cookies.remove('accessToken');
                    cookies.remove('refreshToken');
                    router.push('/login');
                } else {
                    toast.error(err.message || "Failed to fetch data.");
                }

                throw err;
            }
        },
        enabled: !!cookies.get('accessToken') && enabled,
        retry: false, // No retry for auth requests
    });
};