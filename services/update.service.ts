import axiosInstance from "@/helpers/axios/axiosInstance";

export const updateService = {
    requestFormData: async (
    endpoint: string,
    payload: any,
    auth: boolean = true,
    cookies?: any
  ) => {
    const headers: Record<string, string> = {};

      if (auth && cookies) {
      const token = cookies.get("accessToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const isFormData = payload instanceof FormData;

    const response = await axiosInstance.patch(endpoint, payload, {
       headers: {
        ...headers,
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
      },
    });
    return response?.data;
  },
};
