import { cache } from "react";
import superjson from 'superjson';
import { headers, cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { initTRPC, TRPCError } from '@trpc/server';
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createTRPCContext = cache(async () => {
    return {};
});

const t = initTRPC.create({
    transformer: superjson
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure.use(async ({ next }) => {
    const database = await db;
    return next({ ctx: { db: database } });
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const headersList = await headers();
    const cookieStore = await cookies();

    const authHeader = headersList.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || cookieStore.get('token')?.value;

    if (!token) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);

        if (user.length === 0 || user[0].role !== 'admin') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Admin access required'
            });
        }

        return next({
            ctx: {
                ...ctx,
                user: user[0],
            },
        });
    } catch {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid token'
        });
    }
});

export const protectedProcedure = baseProcedure.use(isAuthed);