import {File, Image as ImageIcon} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card.jsx"
import {Input} from "@/components/ui/input.jsx"
import {PhotoTile} from "../ui/PhotoTile.jsx"

export function CoverPanel({cover, onOpen, onUpload}) {
    const handleUpload = (event) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (file) onUpload(file)
    }

    return (
        <Card
            className="flex flex-col rounded-[18px] border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E] sm:col-start-3">
            <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <span className="text-center text-sm font-semibold tracking-tight text-[#1C1C1E] dark:text-white">
                        Обложка товара
                    </span>
                    <span className="text-center text-xs leading-normal text-[#8E8E93] dark:text-[#98989D]">
                        Кликните на фото, чтобы выбрать обложку товара, или загрузите своё.
                    </span>
                </div>

                <div className="flex w-full flex-col gap-3">
                    {cover ? (
                        <PhotoTile
                            src={cover}
                            alt="Обложка товара"
                            fluid
                            onOpen={onOpen}
                            openLabel="Просмотр"
                        />
                    ) : (
                        <div
                            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-[#D1D1D6] bg-[#F2F2F7] p-4 text-center dark:border-[#48484A] dark:bg-[#2C2C2E]">
                            <div
                                className="rounded-full bg-white p-3 text-[#8E8E93] shadow-sm dark:bg-[#3A3A3C] dark:text-[#AEAEB2]">
                                <ImageIcon className="size-6" aria-hidden="true"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-[#6E6E73] dark:text-[#AEAEB2]">
                                    Обложка не выбрана
                                </span>
                                <span className="max-w-[180px] text-[10px] text-[#8E8E93] dark:text-[#98989D]">
                                    Выберите фото из списка или загрузите файл
                                </span>
                            </div>
                        </div>
                    )}

                    <label
                        className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-medium text-[#007AFF] shadow-sm transition-all hover:bg-[#F2F2F7] active:scale-[0.98] dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:text-[#0A84FF] dark:hover:bg-[#3A3A3C]">
                        <File className="size-4" aria-hidden="true"/>
                        <span>Загрузить фото</span>
                        <Input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleUpload}
                        />
                    </label>
                </div>
            </CardContent>
        </Card>
    )
}