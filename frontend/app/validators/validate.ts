import { z } from "zod";

export const fraudSchema = z.object({
  fraud_message: z
    .string()
    .min(1, "Pesan fraud wajib diisi")
    .max(1000, "Pesan terlalu panjang"),
  types: z.string().min(1, "Jenis fraud wajib dipilih"),
});

// Infer type otomatis untuk typescript
export type FraudSchema = z.infer<typeof fraudSchema>;

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user'], { required_error: 'Select a role' }),
});

export type UserInput = z.infer<typeof userSchema>;