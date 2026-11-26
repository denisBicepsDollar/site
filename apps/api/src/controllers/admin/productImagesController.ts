import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import type { Request, Response } from "express";

export const adminProductImageDirectory = path.resolve("uploads/admin-products");
export const receiveProductImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype));
  },
}).single("image");

export async function uploadProductImage(req: Request, res: Response) {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) return res.status(400).json({ message: "An image file is required" });
  const extension = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" } as Record<string, string>)[file.mimetype];
  if (!extension) return res.status(400).json({ message: "Unsupported image type" });
  await mkdir(adminProductImageDirectory, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(adminProductImageDirectory, filename), file.buffer, { flag: "wx" });
  return res.status(201).json({ url: `/uploads/admin-products/${filename}` });
}
