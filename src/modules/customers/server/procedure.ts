import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { users, orders, addresses } from "@/db/schema/schema";
import { desc, asc, eq, and, gte, lte, sql, count, like, or } from "drizzle-orm";

export const customersRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().uuid().optional(),
                role: z.enum(['customer', 'employee', 'admin', 'super-admin']).optional(),
                searchTerm: z.string().optional(), 
                emailVerified: z.boolean().optional(),
                phoneVerified: z.boolean().optional(),
                startDate: z.string().datetime().optional(),
                endDate: z.string().datetime().optional(),
                sortBy: z.enum(['createdAt', 'firstName', 'email', 'lastLoginAt']).default('createdAt'),
                sortOrder: z.enum(['asc', 'desc']).default('desc'),
            })
        )
        .query(async ({ input }) => {
            const {
                limit,
                cursor,
                role,
                searchTerm,
                emailVerified,
                phoneVerified,
                startDate,
                endDate,
                sortBy,
                sortOrder
            } = input;

            const conditions = [];
            
            conditions.push(sql`${users.deletedAt} IS NULL`);
            
            if (role) {
                conditions.push(eq(users.role, role));
            }
            
            if (emailVerified !== undefined) {
                conditions.push(eq(users.emailVerified, emailVerified));
            }

            if (phoneVerified !== undefined) {
                conditions.push(eq(users.phoneVerified, phoneVerified));
            }
            
            if (searchTerm) {
                conditions.push(
                    or(
                        like(users.firstName, `%${searchTerm}%`),
                        like(users.lastName, `%${searchTerm}%`),
                        like(users.email, `%${searchTerm}%`),
                        like(users.phone, `%${searchTerm}%`)
                    )
                );
            }
            
            if (startDate) {
                conditions.push(gte(users.createdAt, new Date(startDate)));
            }
            
            if (endDate) {
                conditions.push(lte(users.createdAt, new Date(endDate)));
            }

            if (cursor) {
                const cursorUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, cursor))
                    .limit(1);

                if (cursorUser.length > 0) {
                    const cursorValue = cursorUser[0][sortBy];
                    if (sortOrder === 'desc') {
                        conditions.push(sql`${users[sortBy]} < ${cursorValue}`);
                    } else {
                        conditions.push(sql`${users[sortBy]} > ${cursorValue}`);
                    }
                }
            }

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            const customersData = await db
                .select({
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    phone: users.phone,
                    role: users.role,
                    emailVerified: users.emailVerified,
                    phoneVerified: users.phoneVerified,
                    lastLoginAt: users.lastLoginAt,
                    createdAt: users.createdAt,
                    updatedAt: users.updatedAt,
                    orderCount: sql<number>`(
                        SELECT COUNT(*)::int 
                        FROM ${orders} 
                        WHERE ${orders.userId} = ${users.id}
                    )`,
                    totalSpent: sql<string>`(
                        SELECT COALESCE(SUM(${orders.total}), 0)
                        FROM ${orders}
                        WHERE ${orders.userId} = ${users.id}
                        AND ${orders.paymentStatus} = 'completed'
                    )`,
                })
                .from(users)
                .where(whereClause)
                .orderBy(sortOrder === 'desc' ? desc(users[sortBy]) : asc(users[sortBy]))
                .limit(limit + 1); 

            if (!customersData || customersData.length === 0) {
                return {
                    data: [],
                    nextCursor: null,
                    hasNextPage: false,
                    total: 0,
                };
            }

            const totalResult = await db
                .select({ count: count() })
                .from(users)
                .where(whereClause);
            
            const total = totalResult[0]?.count || 0;

            const hasNextPage = customersData.length > limit;
            const data = hasNextPage ? customersData.slice(0, -1) : customersData;
            const nextCursor = hasNextPage ? data[data.length - 1].id : null;

            return {
                data,
                nextCursor,
                hasNextPage,
                total,
            };
        }),

    getById: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            const customer = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.id, input.id),
                    sql`${users.deletedAt} IS NULL`
                ))
                .limit(1);

            if (!customer || customer.length === 0) {
                throw new Error("Customer not found");
            }

            return customer[0];
        }),

    getCustomerDetails: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            const customer = await db
                .select({
                    user: users,
                })
                .from(users)
                .where(and(
                    eq(users.id, input.id),
                    sql`${users.deletedAt} IS NULL`
                ))
                .limit(1);

            if (!customer || customer.length === 0) {
                throw new Error("Customer not found");
            }

            const customerAddresses = await db
                .select()
                .from(addresses)
                .where(and(
                    eq(addresses.userId, input.id),
                    sql`${addresses.deletedAt} IS NULL`
                ));

            const orderStats = await db
                .select({
                    totalOrders: count(),
                    totalSpent: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
                    completedOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'delivered' THEN 1 END)`,
                    pendingOrders: sql<number>`COUNT(CASE WHEN ${orders.status} IN ('pending', 'processing', 'confirmed') THEN 1 END)`,
                })
                .from(orders)
                .where(eq(orders.userId, input.id));

            return {
                customer: customer[0].user,
                addresses: customerAddresses,
                stats: orderStats[0],
            };
        }),

    getStats: baseProcedure
        .input(
            z.object({
                startDate: z.string().datetime().optional(),
                endDate: z.string().datetime().optional(),
            })
        )
        .query(async ({ input }) => {
            const conditions = [sql`${users.deletedAt} IS NULL`];
            
            if (input.startDate) {
                conditions.push(gte(users.createdAt, new Date(input.startDate)));
            }
            
            if (input.endDate) {
                conditions.push(lte(users.createdAt, new Date(input.endDate)));
            }

            const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

            const stats = await db
                .select({
                    totalCustomers: count(),
                    verifiedEmails: sql<number>`COUNT(CASE WHEN ${users.emailVerified} = true THEN 1 END)`,
                    verifiedPhones: sql<number>`COUNT(CASE WHEN ${users.phoneVerified} = true THEN 1 END)`,
                    customerRole: sql<number>`COUNT(CASE WHEN ${users.role} = 'customer' THEN 1 END)`,
                    employeeRole: sql<number>`COUNT(CASE WHEN ${users.role} = 'employee' THEN 1 END)`,
                    adminRole: sql<number>`COUNT(CASE WHEN ${users.role} = 'admin' THEN 1 END)`,
                })
                .from(users)
                .where(whereClause);

            return stats[0];
        }),
});