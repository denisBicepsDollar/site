/* Плитка «+ Фото» — загрузка файлов в вариант */
import {SIZES} from '../constants.js'

export function UploadTile({onFiles, className = "", size}) {
    const handleChange = event => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";

        if (files.length) onFiles(files);
    };
    const {wrapper} = SIZES[size];


    return (
        <label className={`flex ${wrapper} shrink-0 cursor-pointer flex-col items-center justify-center
                           gap-0.5 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50
                           hover:border-zinc-900 hover:bg-white ${className}`}>
            <span className="text-sm">+</span>
            <span className="text-[9px] uppercase">Фото</span>
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleChange}
            />
        </label>
    );
}