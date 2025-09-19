"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  ShoppingCart,
  Heart,
  Package,
  LogOut,
  Edit,
  Save,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/app/components/page-header";
import { useGet } from "@/hooks/useGet";
import { useCookies } from "next-client-cookies";
import { useUpdate } from "@/hooks/useUpdate";
import { useAuthGet } from "@/hooks/useAuthGet";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/lib/auth";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock?: boolean;
  slug?: string;
}

// Get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "shipped":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "processing":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading1, setIsLoading] = useState(true);
  const cookies = useCookies();
  const id = cookies.get("id");
  type UserInfo = {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
  };

  const { data, isLoading, refetch, error } = useGet<{ data?: UserInfo }>(
    `/auth/userInfo/${id}`,
    ["userInfo"]
  );

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
    refetch: orderRefetch,
  } = useAuthGet<{ data?: any }>(`/orders`, ["orderInfo"], true);

  const orderInfo = orderData?.data;

  const userInfo = data?.data;
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (userInfo) {
      setUserData({
        name: userInfo.fullName || "",
        email: userInfo.email || "",
        phone: userInfo.phoneNumber || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo, data]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: updateUserInfo } = useUpdate(
    `/auth/update-userInfo/${id}`,
    () => {
      // toast.success("Tag updated successfully");
      refetch?.();
      setIsEditing(false);
    }
  );

  const handleSavePersonalInfo = () => {
    const updatedData = {
      fullName: userData.name,
      email: userData.email,
      phoneNumber: userData.phone,
      address: userData.address,
    };
    updateUserInfo(updatedData);
  };

  const { mutate: updateUserPassword } = useUpdate(
    `/auth/change-password/${id}`,
    () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  );

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPassword(passwordData);
  };

  const removeItem = (id: string) => {
    try {
      const updatedItems = wishlistItems.filter((item) => item.id !== id);
      setWishlistItems(updatedItems);
      localStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("wishlistUpdated"));
      // toast.success("Item removed from wishlist")
    } catch (error) {
      console.error("Error removing item:", error);
      // toast.error("Failed to remove item")
    }
  };

  const moveToCart = (id: string) => {
    try {
      const itemToMove = wishlistItems.find((item) => item.id === id);
      if (!itemToMove) return;

      // Get current cart items
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item: { id: string }) => item.id === id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cartItems.push({ ...itemToMove, quantity: 1 });
      }

      // Update cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));

      // Remove from wishlist
      removeItem(id);

      // toast.success("Item moved to cart")
    } catch (error) {
      console.error("Error moving to cart:", error);
      // toast.error("Failed to move item to cart")
    }
  };

  useEffect(() => {
    const updateWishlist = () => {
      try {
        const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
        setWishlistItems(items);
      } catch (error) {
        console.error("Error updating wishlist:", error);
        // toast.error("Failed to load wishlist")
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    updateWishlist();

    // Set up event listeners
    const handleStorageUpdate = () => updateWishlist();
    window.addEventListener("wishlistUpdated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="My Account"
        description="Manage your profile, orders, and preferences"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/diverse-group.png" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 rounded-full bg-rose-600 p-1 text-white shadow-sm">
                    <Upload size={16} />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{userData.name}</h3>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                    activeTab === "personal"
                      ? "bg-rose-50 text-rose-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("personal")}
                >
                  <User size={18} />
                  <span>Personal Info</span>
                </Link>
                <Link
                  href="/profile?tab=orders"
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                    activeTab === "orders"
                      ? "bg-rose-50 text-rose-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package size={18} />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/profile?tab=wishlist"
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 ${
                    activeTab === "wishlist"
                      ? "bg-rose-50 text-rose-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-100"
                >
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs
            defaultValue="personal"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      isEditing ? handleSavePersonalInfo() : setIsEditing(true)
                    }
                  >
                    {isEditing ? (
                      <>
                        <Save size={16} className="mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit">Update Password</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View your past orders and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderInfo?.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No orders found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't placed any orders yet
                        </p>
                        <div className="mt-6">
                          <Link href="/products">
                            <Button className="bg-rose-600 hover:bg-rose-700">
                              Browse Products
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      orderInfo?.map((order: any) => (
                        <div key={order._id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">
                                ORD-{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge
                                className={getStatusBadgeColor(order.status)}
                              >
                                {order.status}
                              </Badge>
                              <Link href={`/orders/${order._id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="space-y-3">
                            {order.items?.map((item: any) => (
                              <div
                                key={item._id}
                                className="flex items-center space-x-4"
                              >
                                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                  <Image
                                    src={
                                      item.product?.images?.[0] ||
                                      "/generic-product-display.png"
                                    }
                                    alt={item.product?.name || "Product"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {item.product?.name || "Unknown Product"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity} × ৳
                                    {item.price?.toFixed(2)}
                                  </p>
                                </div>
                                <div className="font-medium">
                                  ৳{(item.quantity * item.price)?.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {order.items?.length} item
                              {order.items?.length !== 1 ? "s" : ""}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="font-medium">
                                ৳{order.total?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>
                    Items you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistItems?.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Your wishlist is empty
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Save items you love by clicking the heart icon on
                        products
                      </p>
                      <div className="mt-6">
                        <Link href="/products">
                          <Button className="bg-rose-600 hover:bg-rose-700">
                            Browse Products
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {wishlistItems?.map((item) => (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square relative">
                            <Image
                              src={item.image || "/generic-product-display.png"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                          </div>
                          <div className="p-4">
                            <Link href={`/products/${item.slug || item.id}`}>
                              <h3 className="font-medium hover:text-rose-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500">
                              {item.category || "Uncategorized"}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="font-medium">
                                ৳{item.price.toFixed(2)}
                              </p>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moveToCart(item.id)}
                                >
                                  <ShoppingCart size={16} className="mr-2" />
                                  Add to Cart
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Heart size={16} className="fill-current" />
                                  <span className="sr-only">
                                    Remove from wishlist
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
