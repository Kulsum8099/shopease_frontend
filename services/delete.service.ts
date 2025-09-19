import axiosInstance from "@/helpers/axios/axiosInstance";

export const deleteService = {
  delete: async (
    endpoint: string,
    payload?: Record<string, any>,
    auth: boolean = true,
    cookies?: any
  ) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (auth && cookies) {
      const token = cookies.get("accessToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await axiosInstance.delete(endpoint, {
      headers,
      data: payload || undefined, // Axios DELETE body goes to `data`
    });

    return response.data;
  },
};
