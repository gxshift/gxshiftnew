import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(3, "Nama minimal 3 karakter"),
  whatsappNumber: z.string().min(9, "Nomor WhatsApp tidak valid (min. 9 angka)").regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
  nickname: z.string().min(2, "Nickname in-game wajib diisi"),
  serverId: z.string().min(4, "Server ID wajib diisi"),
  currentRank: z.string().min(2, "Rank saat ini wajib diisi (Contoh: Epic 2)"),
  levelId: z.string().uuid("Pilih target rank/paket yang tersedia"),
  notes: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;