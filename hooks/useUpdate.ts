import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCookies } from "next-client-cookies";
import { updateService } from "@/services/update.service";

export const useUpdate = <T>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  options?: {
    auth?: boolean;
  },
  onError?: (error: Error | string) => void
) => {
  const cookies = useCookies();
  return useMutation({
    mutationFn: (payload:  Record<string, unknown> | FormData | unknown) =>
      updateService.requestFormData(endpoint, payload, options?.auth ?? true, cookies),
    onSuccess: (data) => {
      console.log("Data updated successfully", data);
      toast.success(data?.message || "Update successful");
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update data";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }

      console.error("Update error details:", error);
      toast.error(errorMessage);
      onError?.(new Error(errorMessage));
    },
  });
};
