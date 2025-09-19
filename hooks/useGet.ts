import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "@/helpers/axios/axiosInstance";
import type { AxiosError, AxiosRequestConfig } from "axios";

export const useGet = <T>(
  endpoint: string,
  queryKey: string[],
  enabled: boolean = true,
  config?: AxiosRequestConfig,
): UseQueryResult<T, AxiosError> => {
  return useQuery<T, AxiosError>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<T>(endpoint, config);
        return response?.data;
      } catch (error) {
        const err = error as AxiosError;
        toast.error(err.message || "Failed to fetch data.");
        throw err;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};


