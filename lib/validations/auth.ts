import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email notogri"),
    password: z.string().min(6, "Parol kamida 6 belgi bolishi kerak"),
});

export const registerSchema = z
    .object({
        full_name: z.string().min(2, "Ismingizni kiriting"),
        email: z.string().email("Email notogri"),
        phone: z.string().optional(),
        password: z.string().min(6, "Parol kamida 6 belgi bolishi kerak"),
        confirm_password: z.string().min(6, "Parolni tasdiqlang"),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Parollar mos emas",
        path: ["confirm_password"],
    });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;