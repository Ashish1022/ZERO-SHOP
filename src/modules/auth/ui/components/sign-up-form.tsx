"use client"

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader, Lock, Mail, Phone, Store, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "../../schema";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    onSuccess: (userData: z.infer<typeof registerSchema>) => void;
}

export const SignUpForm = ({ onSuccess }: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            phone: '',
            password: '',
            firstName: '',
            lastName: '',
            role: "customer",
        }
    });

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const registerMutation = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async (_, data: z.infer<typeof registerSchema>) => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
            onSuccess(data);
        }
    }));

    const onSubmit = (data: z.infer<typeof registerSchema>) => {
        registerMutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="John"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Doe"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Email Field */}
                <FormField
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Phone Field */}
                <FormField
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <FormLabel htmlFor="phone">Phone</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <PhoneInput
                                            defaultCountry={'IN'}
                                            {...field}
                                            placeholder="Enter phone no."
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full cursor-pointer" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? (
                        <div className="flex items-center">
                            Creating Account...
                            <Loader className="ml-2 h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        <div className="flex items-center">
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    )}
                </Button>
            </form>
        </Form>
    );
};
