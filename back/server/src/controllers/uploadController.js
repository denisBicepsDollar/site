import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Папка куда сохраняем картинки
const uploadDir = path.join(__dirname, '../../../shop/images');

// Создаём папку если нет
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // транслитерация не нужна — используем оригинальное имя + timestamp если конфликт
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();
        const filename = `${base}${ext}`;
        const fullPath = path.join(uploadDir, filename);

        // если файл уже есть — добавляем timestamp
        if (fs.existsSync(fullPath)) {
            cb(null, `${base}-${Date.now()}${ext}`);
        } else {
            cb(null, filename);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Только изображения: jpg, png, webp, svg'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload
export async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }
        const filePath = `/images/${req.file.filename}`;
        console.log('[uploadController] uploaded:', filePath);
        return res.status(201).json({ path: filePath });
    } catch (err) {
        console.error('[uploadController] error:', err);
        return res.status(500).json({ error: err.message });
    }
}
