"use client"

import { ArrowRight, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { otpSchema, registerSchema } from "../../schema";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import toast from "react-hot-toast";

interface Props {
    userData: z.infer<typeof registerSchema>;
    onSuccess: () => void;
    canResend: boolean;
    timer: number;
    onResend: () => void;
    isResending?: boolean;
}

export const OtpForm = ({ userData, onResend, onSuccess, timer, canResend, isResending }: Props) => {

    const [otpValue, setOtpValue] = useState("");

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    });

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const verifyMutation = useMutation(trpc.auth.verify.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            onSuccess();
        }
    }))

    const onSubmit = (data: z.infer<typeof otpSchema>) => {
        verifyMutation.mutate({
            ...userData,
            otp: data.otp
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    name="otp"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <FormControl>
                                    <div className="relative flex items-center justify-center flex-col">
                                        <InputOTP
                                            maxLength={6}
                                            value={otpValue}
                                            onChange={(value) => {
                                                setOtpValue(value);
                                                field.onChange(value);
                                            }}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full cursor-pointer" disabled={verifyMutation.isPending}>
                    {verifyMutation.isPending ? (
                        <div className="flex items-center">
                            Verifying...
                            <Loader className="ml-2 h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        <div className="flex items-center">
                            Verify
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    )}
                </Button>
                {canResend ? (
                    <Button
                        className="hover:underline outline-none mt-2 cursor-pointer text-xs" variant={"outline"}
                        type='button'
                        onClick={onResend}
                        disabled={isResending}
                    >
                        {isResending ? (
                            <div className="flex items-center">
                                Resending...
                                <Loader className="ml-2 h-3 w-3 animate-spin" />
                            </div>
                        ) : (
                            "Resend OTP ?"
                        )}
                    </Button>
                ) : (
                    `Resend OTP in ${timer}s`
                )}
            </form>
        </Form>
    )
}