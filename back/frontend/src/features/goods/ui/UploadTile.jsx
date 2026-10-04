/* Плитка «+ Фото» — загрузка файлов в вариант */
export function UploadTile({onFiles, className = ""}) {
    const handleChange = event => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";

        if (files.length) onFiles(files);
    };

    return (
        <label className={`flex h-16 w-20 shrink-0 cursor-pointer flex-col items-center justify-center
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
