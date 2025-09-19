import { deleteService } from "@/services/delete.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCookies } from "next-client-cookies";

export const useDeleteData = <T>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  options?: {
    auth?: boolean;
  },
  onError?: (error: Error | string) => void
) => {
  const cookies = useCookies();

  return useMutation({
    mutationFn: (payload?: Record<string, unknown>) =>
      deleteService.delete(endpoint, payload, options?.auth ?? true, cookies),

    onSuccess: (data) => {
      toast.success(data.message || "Deleted successfully");
      onSuccess?.(data);
    },

    onError: (error: unknown) => {
      let errorMessage = "Failed to delete data";
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Delete error:", error);
        onError?.(error);
      } else {
        toast.error("An unknown error occurred");
        console.error("Unknown delete error:", error);
        onError?.(new Error(errorMessage));
      }
    },
  });
};
