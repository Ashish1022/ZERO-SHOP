import { cookies as getCookies } from 'next/headers'

export const generateAuthCookie = async ({ value, prefix }: { value: string, prefix: string }) => {
    const cookies = await getCookies();
    const isProduction = process.env.NODE_ENV === "production";
    cookies.set({
        name: `${prefix}`,
        value: value,
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: isProduction,
        path: "/",
    });
};