"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// A dedicated, more visible Alert component for displaying errors
const ErrorAlert = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-red-500 bg-red-50 p-3 text-sm text-red-700"
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

const SignInForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: "onBlur",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    if (formError) {
      setFormError(null);
    }
  }, [email, password]);

  // Redirect user if they are already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      setIsLoading(true);
      const role = session.user.role;
      const destination =
        {
          admin: "/admin",
          manager: "/manager",
          reviewer: "/reviewer",
          applicant: "/applicant",
        }[role] || "/";
      router.push(destination);
    }
  }, [status, session, router]);

  const onSubmit = async (data: SignInFormData) => {
    setFormError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        switch (result.error) {
          case "CredentialsSignin":
            setFormError("Invalid email or password. Please try again.");
            break;
          default:
            setFormError(
              "An unexpected error occurred. Please try again later."
            );
        }
      }
      // Successful sign-in is handled by the redirecting useEffect
    } catch (err) {
      console.error("Sign-in submission failed:", err);
      setFormError(
        "Could not connect to the server. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Sign-in successful. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/assets/Logo.png"
              alt="Logo"
              className="h-12 w-auto"
              width={120}
              height={48}
              priority
            />
          </Link>
        </div>
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new applicant account
            </Link>
          </p>
        </div>

        <ErrorAlert message={formError || ""} />

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.email
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.password
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="********"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/forgetPassword"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
