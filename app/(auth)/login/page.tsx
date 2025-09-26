"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/app/components/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCookies } from "next-client-cookies";
import { usePostFormData } from "@/hooks/usePost";

interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
    id: string;
  };
}

export default function LoginPage() {
  const cookies = useCookies();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [backendError, setBackendError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // clear field errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // clear backend error when user edits
    if (backendError) {
      setBackendError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const { mutate: login, isPending } = usePostFormData<LoginResponse>(
    "/auth/signin",
    (responseData) => {
      // ✅ set cookies with production-safe options
      cookies.set("accessToken", responseData.data.accessToken, {
        sameSite: "None",
        secure: true,
      });
      cookies.set("refreshToken", responseData.data.refreshToken, {
        sameSite: "None",
        secure: true,
      });
      cookies.set("role", responseData.data.role, {
        sameSite: "None",
        secure: true,
      });
      cookies.set("id", responseData.data.id, {
        sameSite: "None",
        secure: true,
      });

      console.log("✅ Login success", responseData);
      router.push("/profile");
    },
    { auth: false },
    (error) => {
      console.error("❌ Login error:", error);
      setBackendError(error.message);
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError("");

    if (!validateForm()) return;

    setIsLoading(true);
    login(formData, {
      onSettled: () => setIsLoading(false), // ✅ fix race condition
    });
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access your account"
    >
      {backendError && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{backendError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-rose-600 hover:text-rose-500"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700"
          disabled={isLoading || isPending}
        >
          {isLoading || isPending ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-rose-600 hover:text-rose-500"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
