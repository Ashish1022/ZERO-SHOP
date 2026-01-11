import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { headers as getHeaders } from 'next/headers';

import { users } from '@/db/schema/schema';
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

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
})