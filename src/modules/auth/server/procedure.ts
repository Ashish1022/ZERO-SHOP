import { headers as getHeaders } from 'next/headers';
import { loginSchema, registerSchema, verifySchema } from '../schema';
import { generateAuthCookie } from '../lib/cookie';
import { checkOtpRestrictions, sendOtp, trackOtpRequests, verifyOtp } from '../lib/utils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from '@trpc/server';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();
        const cookieHeader = headers.get('cookie');

        if (!cookieHeader) {
            return { user: null, isAuthenticated: false };
        }

        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        if (!tokenMatch) {
            return { user: null, isAuthenticated: false };
        }

        try {
            const decoded = jwt.verify(tokenMatch[1], process.env.JWT_SECRET!) as { userId: string };
            const user = await ctx.db
                .select({
                    id: users.id,
                    email: users.email,
                    firstname: users.firstName,
                    lastname: users.lastName,
                    phone: users.phone,
                    role: users.role,
                })
                .from(users)
                .where(eq(users.id, decoded.userId))
                .limit(1);

            if (user.length === 0) {
                return { user: null, isAuthenticated: false };
            }

            return { user: user[0], isAuthenticated: true };
        } catch (error) {
            return { user: null, isAuthenticated: false };
        }
    }),
    login: baseProcedure
        .input(loginSchema)
        .mutation(async ({ ctx, input }) => {
            const existingUser = await ctx.db
                .select()
                .from(users)
                .where(eq(users.email, input.email))
                .limit(1);

            if (existingUser.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Email does not exist!"
                });
            }

            const user = existingUser[0];

            const isValidPassword = await bcrypt.compare(input.password, user.password);
            if (!isValidPassword) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid credentials!"
                });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            await generateAuthCookie({
                prefix: "token",
                value: token,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstName,
                    lastname: user.lastName,
                    phone: user.phone,
                    role: user.role
                },
                token
            };
        }),
    register: baseProcedure
        .input(registerSchema)
        .mutation(async ({ ctx, input }) => {
            const existingUser = await ctx.db
                .select()
                .from(users)
                .where(or(
                    eq(users.email, input.email),
                    eq(users.phone, input.phone)
                ))
                .limit(1);

            if (existingUser.length > 0) {
                const match = existingUser[0];
                if (match.email === input.email) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Email is already registered."
                    });
                }
                if (match.phone === input.phone) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Phone number already in use"
                    });
                }
            }

            try {
                await checkOtpRestrictions(input.email);
                await trackOtpRequests(input.email);
                await sendOtp(input.firstName, input.email, "seller-activation");
            } catch (error) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: error instanceof Error ? error.message : "Failed to send OTP"
                });
            }

            return { message: "OTP sent to email. Please verify your account." };
        }),
    verify: baseProcedure
        .input(verifySchema)
        .mutation(async ({ ctx, input }) => {
            try {
                await verifyOtp(input.email, input.otp);
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: error instanceof Error ? error.message : "Invalid OTP or OTP expired"
                });
            }

            const hashedPassword = await bcrypt.hash(input.password, 12);

            const newUser = await ctx.db
                .insert(users)
                .values({
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    phone: input.phone,
                    role: input.role as 'employee' | 'admin',
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning({
                    id: users.id,
                    email: users.email,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    phone: users.phone,
                    role: users.role
                });

            const token = jwt.sign(
                { userId: newUser[0].id, email: newUser[0].email },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            await generateAuthCookie({
                value: token,
                prefix: "token"
            });

            return {
                user: newUser[0],
                token
            };
        })
})