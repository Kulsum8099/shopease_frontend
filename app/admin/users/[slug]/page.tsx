"use client"
import { useGet } from "@/hooks/useGet";
import { useUpdate } from "@/hooks/useUpdate";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Edit, Eye, EyeOff, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const Page = ({ params }: { params: { slug: string } }) => {
      const [activeTab, setActiveTab] = useState("personal");
      const [isEditing, setIsEditing] = useState(false);
      const [showCurrentPassword, setShowCurrentPassword] = useState(false);
      const [showNewPassword, setShowNewPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [isLoading1, setIsLoading] = useState(true);
    const id=params?.slug;
      type UserInfo = {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
      };
    
      const { data, isLoading, refetch, error } = useGet<{ data?: UserInfo }>(
        `/auth/userInfo/${id}`,
        ["userInfoUsers"]
      );
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
  return (
    <div className="container mx-auto px-4">
      {/* <PageHeader
        title="My Account"
        description="Manage your profile, orders, and preferences"
      /> */}
      <div className="w-full">
        {/* Sidebar */}
        {/* <div className="md:col-span-1">
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
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 ${activeTab === "personal"
                    ? "bg-rose-50 text-rose-600"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setActiveTab("personal")}
                >
                  <User size={18} />
                  <span>Personal Info</span>
                </Link>
                     <Link
                  href="/logout"
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div> */}

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs
            defaultValue="personal"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {/* <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
            </TabsList> */}

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Update User details</CardDescription>
                  </div>
                  {/* <Button
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
                  </Button> */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <p className="text-muted-foreground">{userData.name}</p>
                      {/* <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      /> */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <p className="text-muted-foreground">{userData.email}</p>
                      {/* <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      /> */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <p className="text-muted-foreground">{userData.phone}</p>
                      {/* <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      /> */}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <p className="text-muted-foreground">
                        {userData.address}
                      </p>
                      {/* <Input
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                      /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update user password to keep user account secure
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
              </Card> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
