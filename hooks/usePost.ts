import { postService } from "@/services/post.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCookies } from "next-client-cookies";

export const usePostFormData = <T>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  options?: {
    auth?: boolean;
  },
    onError?: (error: Error | string) => void
) => {
  const cookies = useCookies();

  return useMutation({
    mutationFn: (payload: Record<string, unknown> | FormData | unknown) =>
      postService.requestFormData(endpoint, payload, options?.auth ?? true, cookies),

    onSuccess: (data) => {
      toast.success(data.message || "Success");
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update data";
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.errorMessages) {
          // Handle validation errors from backend
          const validationErrors = axiosError.response.data.errorMessages;
          if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            errorMessage = validationErrors.map((err: any) => err.message).join(', ');
          }
        } else if (axiosError.response?.status === 409) {
          errorMessage = "User already exists with this email";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "Invalid credentials";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "User not found";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid input data";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("Post error:", error);
      onError?.(new Error(errorMessage));
    },
  });
};
