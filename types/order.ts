// types/order.ts
export interface OrderItem {
    product: string | { name: string }; // Can be ID or populated product
    quantity: number;
    price: number;
    color?: string;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}