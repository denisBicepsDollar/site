import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {EmptyState} from "@/components/shared/ui/EmptyState.jsx";

import {useProductForm} from "./model/useProductForm.js";
import {collectPhotos, findCoverIndex, findVariantPhotoIndex, stepIndex} from "./model/photos.js";


import {Save} from 'lucide-react'

import {GeneralInfoSection} from "./components/GeneralInfoSection.jsx";
import {DescriptionSection} from "./components/DescriptionSection.jsx";
import {PhotosSection} from "./components/PhotosSection.jsx";
import {VariantsSection} from "./components/VariantsSection.jsx";
import {StatusSection} from "./components/StatusSection.jsx";
import {NotesSection} from "../../../components/ui/notes-section.jsx";
import {PhotoViewer} from "./components/PhotoViewer.jsx";
import {EntityHeader} from "@/components/ui/entity-page-header.jsx";

/* Обёртка нужна ради key: при переходе на другой товар форма монтируется заново
   и не тащит в себе данные предыдущего товара. */
export function ProductPage() {
    const {id} = useParams();

    return <ProductForm key={id} id={id}/>;
}

function ProductForm({id}) {
    const navigate = useNavigate();
    const form = useProductForm(id);

    /* Индекс открытого фото в общем списке (null — просмотрщик закрыт) */
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);

    const photos = useMemo(() => collectPhotos(form.cover, form.variants), [form.cover, form.variants]);
    const activePhoto = activePhotoIndex === null ? null : photos[activePhotoIndex] ?? null;

    /* ── Просмотрщик фото ────────────────────────────────────────────────── */

    const openVariantPhoto = (variantIndex, imageIndex) => {
        const index = findVariantPhotoIndex(photos, variantIndex, imageIndex);
        if (index !== -1) setActivePhotoIndex(index);
    };

    const openCoverPhoto = () => {
        const index = findCoverIndex(photos, form.cover);
        if (index !== -1) setActivePhotoIndex(index);
    };

    const stepPhoto = direction => {
        if (!photos.length) return;
        setActivePhotoIndex(index => stepIndex(index, direction, photos.length));
    };

    /* ── Действия с фото (с подтверждением) ──────────────────────────────── */

    const handleRemovePhoto = (variantIndex, imageIndex) => {
        if (!window.confirm("Удалить это фото?")) return;

        form.removeVariantPhoto(variantIndex, imageIndex);
        setActivePhotoIndex(null);
    };

    const handleMakeProductCover = src => {
        if (!window.confirm("Сделать фото обложкой всего товара?")) return;

        form.setProductCover(src);
        setActivePhotoIndex(null);
    };

    const handleMakeVariantCover = (variantIndex, src) => {
        const variantName = form.variants[variantIndex]?.name;

        if (!window.confirm(`Сделать фото обложкой варианта ${variantName}`)) return;

        form.setVariantCover(variantIndex, src);
        setActivePhotoIndex(null);
    };

    /* ── Разметка ────────────────────────────────────────────────────────── */

    if (!form.item) {
        return (
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
                <div className="w-full rounded-2xl border border-zinc-200 bg-white">
                    <EmptyState
                        title="Товар не найден"
                        description="Возможно, карточка была удалена или ссылка устарела. Вернитесь в каталог и выберите товар из списка."
                    >
                        <Button text="Вернуться в каталог" className="mt-5"
                                onClick={() => navigate("/dashboard/goods")}/>
                    </EmptyState>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted/10 min-h-screen">
            <EntityHeader
                backLabel="К товарам"
                title={name}
                status={
                    <Badge
                        variant={"destructive"}
                        className={
                            "rounded-full bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]"
                            + "rounded-full bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]"
                        }
                    >
                        {"Изменения не сохранены" + "Изменений нет"}
                    </Badge>
                }
                actions={[
                    {
                        id: "save",
                        label: "Сохранить",
                        icon: Save,
                        variant: "default",
                        className:
                            "bg-[#007AFF] px-4 text-white shadow-sm hover:bg-[#006FE6] dark:bg-[#0A84FF] dark:hover:bg-[#168FFF]",
                    },
                ]}
            />

            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-5 p-4 sm:p-5 lg:flex-row">
                {/* Блок слева */}
                <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
                    <GeneralInfoSection
                        name={form.name}
                        onNameChange={form.setName}
                        sku={form.item.sku}
                        updated={form.item.updated}
                        variantsCount={form.variants.length}
                        category={form.category}
                        onCategoryChange={form.setCategory}
                        basePrice={form.basePrice}
                        onBasePriceChange={form.setBasePrice}
                    />

                    <DescriptionSection
                        description={form.description}
                        onDescriptionChange={form.setDescription}
                    />

                    <PhotosSection
                        variants={form.variants}
                        cover={form.cover}
                        onOpenPhoto={openVariantPhoto}
                        onRemovePhoto={handleRemovePhoto}
                        onMakeProductCover={handleMakeProductCover}
                        onCoverUpload={form.uploadCover}
                        onOpenCover={openCoverPhoto}
                    />

                    <VariantsSection
                        variants={form.variants}
                        sizePresets={form.sizePresets}
                        onAddVariant={form.addVariant}
                        onUpdateVariant={form.updateVariant}
                        onRemoveVariant={form.removeVariant}
                        onRemovePhoto={handleRemovePhoto}
                        onMakeVariantCover={handleMakeVariantCover}
                        onUploadPhotos={form.uploadVariantPhotos}
                        onOpenPhoto={openVariantPhoto}
                    />
                </div>

                {/* Блок справа */}
                <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-80">
                    <StatusSection status={form.status} onStatusChange={form.setStatus}/>

                    <NotesSection note={form.note} onNoteChange={form.setNote} MAX_NOTE_LENGTH={100}/>

                    <Button
                        variant="destructive"
                        className="rounded-xl"
                        title="Удаление появится после подключения API каталога"
                    >
                        Удалить товар
                    </Button>

                </aside>
            </div>

            {activePhoto && (
                <PhotoViewer
                    photo={activePhoto}
                    isProductCover={form.cover === activePhoto.src}
                    onClose={() => setActivePhotoIndex(null)}
                    onPrev={() => stepPhoto(-1)}
                    onNext={() => stepPhoto(1)}
                    onMakeProductCover={() => handleMakeProductCover(activePhoto.src)}
                    onMakeVariantCover={() => handleMakeVariantCover(activePhoto.variantIndex, activePhoto.src)}
                />
            )}
        </div>
    );
}