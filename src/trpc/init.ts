import { cache } from "react";
import superjson from "superjson";

import { initTRPC } from "@trpc/server"
import { db } from "@/db";

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
