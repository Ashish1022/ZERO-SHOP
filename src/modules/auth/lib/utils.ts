"use server"

import crypto from 'crypto';
import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';

import { redis } from "@/lib/redis"


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderEmailTemplate = async (templateName: string, data: any): Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        "src",
        "modules",
        "auth",
        "lib",
        "email-templates",
        `${templateName}.ejs`
    )
    return ejs.renderFile(templatePath, data);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async (to: string, subject: string, templateName: string, data: any) => {
    try {
        const html = await renderEmailTemplate(templateName, data);
        await transporter.sendMail({
            from: `${process.env.SMTP_USER}`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const checkOtpRestrictions = async (email: string) => {
    if (await redis.get(`otp_lock:${email}`)) return new Error("Account locked due to multiple failed attempts! Try again after 30 minutes.");
    if (await redis.get(`otp_spam_lock:${email}`)) return new Error("Too many OTP requests! Please wait an hour before requesting again.");
    if (await redis.get(`otp_cooldown:${email}`)) return new Error("Please wait a minute before requesting a new OTP.");
};

export const trackOtpRequests = async (email: string) => {
    const otpRequestKey = `otp_request_count:${email}`
    const otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
        return new Error("Too many OTP requests! Please wait an hour before requesting again.")
    };
    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    await sendEmail(email, "Verify Your Email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (email: string, otp: string) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) throw new Error("Invalid or expired OTP!");

    const failedAttmeptsKey = `otp_attempts:${email}`;
    const failedAttemtps = parseInt((await redis.get(failedAttmeptsKey)) || "0");

    if (storedOtp !== otp) {
        if (failedAttemtps >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
            await redis.del(`otp:${email}`, failedAttmeptsKey);
            throw new Error("Too many failed attempts. Account locked for 30minutes!");
        }
        await redis.set(failedAttmeptsKey, failedAttemtps + 1, "EX", 300);
        return new Error(`Incorrect OTP. ${2 - failedAttemtps} left.`);
    };
    await redis.del(`otp:${email}`, failedAttmeptsKey);
};