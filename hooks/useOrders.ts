import { useQuery } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";

export const useOrders = () => {
    const cookies = useCookies();
    const token = cookies.get("token");

    return useQuery<any>({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        },
    });
};

export const useOrder = (id: string) => {
    const cookies = useCookies();
    const token = cookies.get("token");

    return useQuery<any>({
        queryKey: ["order", id],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Order not found");
            return response.json();
        },
    });
};