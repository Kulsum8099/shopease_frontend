"use client";

import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGet } from "@/hooks/useGet";
import { usePostFormData } from "@/hooks/usePost";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  maxQuantity: number;
};

type ShippingAddress = {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  shippingAddresses?: ShippingAddress[];
};

export default function CheckoutPage() {
  const router = useRouter();
  const cookies = useCookies();
  const id = cookies.get("id");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: true,
  });

  // Fetch user info with shipping addresses
  const { data, isLoading, error, refetch } = useGet<{ data?: UserInfo }>(
    `/auth/userInfo/${id}`,
    ["userInfo"]
  );
  const userInfo = data?.data;

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems);
        const validItems = parsedItems.filter(
          (item: any) =>
            item.id && item.name && !isNaN(item.price) && !isNaN(item.quantity)
        );
        setCartItems(validItems);
      } catch (e) {
        console.error("Error parsing cart items", e);
        setCartItems([]);
      }
    }
  }, []);

  // Set default address on user info load
  useEffect(() => {
    if (userInfo?.shippingAddresses?.length) {
      const defaultAddress = userInfo.shippingAddresses.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(JSON.stringify(defaultAddress));
      }
    }
  }, [userInfo]);

  // Calculate totals with updated shipping logic
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);
  const shipping = subtotal >= 50 ? 0 : 10; // Free shipping over $50, otherwise $10
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Mutation for saving address
  const { mutate: saveAddress } = usePostFormData<{ success: boolean }>(
    "/shipping-addresses",
    () => {
      toast.success("Address saved successfully");
      setIsAddingAddress(false);
      refetch();
    },
    {
      auth: true,
    }
  );

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.min(
              Math.max(1, newQuantity),
              item.maxQuantity || 10
            ),
          }
        : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = () => {
    if (
      !newAddress.fullName ||
      !newAddress.phoneNumber ||
      !newAddress.streetAddress ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    saveAddress({
      ...newAddress,
      userId: id,
    });
  };

  const { mutate: createOrder } = usePostFormData<{
    success: boolean;
    data: {
      _id: string;
      paymentUrl?: string;
    };
  }>(
    paymentMethod === "cod" ? "/orders/cod" : "/orders/ssl-commerz",
    (response) => {
      console.log(response);

      if (paymentMethod === "cod") {
        router.push(
          `/checkout/confirmation?orderId=${response.data._id}&method=cod`
        );
      } else {
        if (response?.data?.paymentUrl)
          window.location.replace(response?.data?.paymentUrl);
      }
      localStorage.removeItem("cartItems");
      setIsProcessing(false);
    },
    {
      auth: true,
    }
  );

  const handleSubmitOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsProcessing(true);

    const shippingAddress = JSON.parse(selectedAddress);

    const orderItems = cartItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
    }));

    const orderData = {
      user: id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phoneNumber,
        street: shippingAddress.streetAddress,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        isDefault: shippingAddress.isDefault,
      },
      paymentMethod: paymentMethod === "cod" ? "cod" : "SSLCommerz",
      paymentStatus: "pending",
      subtotal,
      shippingFee: shipping,
      tax,
      total,
      status: "pending",
    };

    createOrder(orderData);
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader title="Checkout" />

      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center text-rose-600 hover:text-rose-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAddingAddress ? (
                <div className="space-y-4">
                  {userInfo?.shippingAddresses?.length ? (
                    <RadioGroup
                      value={selectedAddress}
                      onValueChange={setSelectedAddress}
                      className="space-y-4"
                    >
                      {userInfo.shippingAddresses.map((address, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={JSON.stringify(address)}
                            id={`address-${index}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`address-${index}`}
                              className="flex items-center cursor-pointer"
                            >
                              <span className="font-medium">
                                {address.fullName}
                              </span>
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </Label>
                            <div className="text-sm text-gray-500 mt-1">
                              <p>{address.streetAddress}</p>
                              <p>
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </p>
                              <p>{address.country}</p>
                              <p className="mt-1">{address.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-gray-500">No saved addresses found</p>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setIsAddingAddress(true)}
                    className="mt-4"
                  >
                    Add New Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={newAddress.fullName}
                        onChange={handleAddressChange}
                        placeholder={userInfo?.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={newAddress.phoneNumber}
                        onChange={handleAddressChange}
                        placeholder={userInfo?.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={newAddress.streetAddress}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">ZIP/Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            isDefault: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <Label htmlFor="isDefault">Set as default address</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4">
                    <Button onClick={handleSaveAddress}>Save Address</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddress({
                          fullName: "",
                          phoneNumber: "",
                          streetAddress: "",
                          city: "",
                          state: "",
                          postalCode: "",
                          country: "",
                          isDefault: true,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="cod" id="cod" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="cod"
                      className="flex items-center cursor-pointer"
                    >
                      <span className="font-medium">Cash on Delivery</span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value="sslcommerz"
                    id="sslcommerz"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="sslcommerz"
                      className="flex items-center cursor-pointer"
                    >
                      <span className="font-medium">SSLCommerz</span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay using SSLCommerz secure payment gateway.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special instructions or notes about your order here..."
                className="resize-none"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        Color: {item.color}
                      </p>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="h-6 w-6 rounded-md"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxQuantity}
                          className="h-6 w-6 rounded-md"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ৳{shipping.toFixed(2)}
                        {subtotal < 50 && (
                          <span className="text-xs text-gray-500 ml-1">
                            (Free shipping on orders over ৳50)
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className="w-full bg-rose-600 hover:bg-rose-700"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isProcessing || !selectedAddress}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>

              {!selectedAddress && (
                <p className="text-sm text-red-500 mt-2">
                  Please select a shipping address
                </p>
              )}

              {/* Security Notice */}
              <div className="text-xs text-gray-500 flex items-center justify-center">
                <ShieldCheck size={14} className="mr-1" />
                <span>Secure checkout powered by SSLCommerz</span>
              </div>

              {/* Shipping & Returns */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center text-sm">
                  <Truck size={16} className="mr-2 text-gray-600" />
                  <span>Free shipping on orders over ৳50</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard size={16} className="mr-2 text-gray-600" />
                  <span>We never store your full payment details</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
