import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import type { Request, Response } from "express";

function resolveApiPackageRoot(): string {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    if (existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  return process.cwd();
}

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/pjpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export const adminProductImageDirectory = path.join(
  resolveApiPackageRoot(),
  "uploads",
  "admin-products",
);

export const receiveProductImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = Object.hasOwn(MIME_TO_EXTENSION, file.mimetype);
    if (!allowed) {
      (req as Request & { fileValidationError?: string }).fileValidationError =
        "Unsupported image type";
    }
    callback(null, allowed);
  },
}).single("image");

export async function uploadProductImage(req: Request, res: Response) {
  const typedReq = req as Request & {
    file?: Express.Multer.File;
    fileValidationError?: string;
  };
  if (typedReq.fileValidationError) {
    return res.status(400).json({ message: typedReq.fileValidationError });
  }
  const file = typedReq.file;
  if (!file) return res.status(400).json({ message: "An image file is required" });
  const extension = MIME_TO_EXTENSION[file.mimetype];
  if (!extension) return res.status(400).json({ message: "Unsupported image type" });
  await mkdir(adminProductImageDirectory, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(adminProductImageDirectory, filename), file.buffer, { flag: "wx" });
  return res.status(201).json({ url: `/uploads/admin-products/${filename}` });
}
