"use client";

import Link from "next/link";

import { ArrowLeft, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OtpForm } from "../components/otp-form";
import { SignUpForm } from "../components/sign-up-form";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { registerSchema } from "../../schema";
import z from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SignupView = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<z.infer<typeof registerSchema>>({
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);

  const router = useRouter();

  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignUpSuccess = (data: z.infer<typeof registerSchema>) => {
    setUserData(data);
    setShowOtp(true);
    startResendTimer();
  };

  const handleOTPSuccess = () => {
    router.push("/admin/dashboard");
  };

  const trpc = useTRPC();

  const resendMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("OTP has been resent to your email");
        startResendTimer();
      },
    })
  );

  const handleResendOTP = () => {
    if (userData.email) {
      resendMutation.mutate(userData);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {!showOtp ? (
              <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl font-heading font-bold text-center">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-center">
                    Fill in your information to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SignUpForm onSuccess={handleSignUpSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                      prefetch
                    >
                      Login
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-muted/30 bg-background/80 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    Enter the OTP
                  </CardTitle>
                  <CardDescription className="text-center">
                    We&apos;ve sent a verification code to {userData.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OtpForm
                    userData={userData}
                    onSuccess={handleOTPSuccess}
                    canResend={canResend}
                    timer={timer}
                    onResend={handleResendOTP}
                    isResending={resendMutation.isPending}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
