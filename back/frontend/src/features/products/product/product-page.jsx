import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/shared/ui/actions/button.jsx";
import {Badge} from "@/shared/ui/display/badge.jsx";
import {EmptyState} from "@/shared/components/EmptyState.jsx";

import {useProductForm} from "./model/useProductForm.js";
import {collectPhotos, findCoverIndex, findVariantPhotoIndex, stepIndex} from "./model/photos.js";

import {Save} from 'lucide-react'

import {GeneralInfoSection} from "./components/general-info-section.jsx";
import {DescriptionSection} from "./components/description-section.jsx";
import {PhotosSection} from "./components/photos-section.jsx";
import {VariantsSection} from "./components/variants-section.jsx";
import {StatusSection} from "./components/status-section.jsx";
import {NotesSection} from "@/shared/ui/sections/notes-section.jsx";
import {PhotoViewer} from "./components/photo-viewer.jsx";
import {EntityHeader} from "@/shared/ui/sections/entity-page-header.jsx";
import {Notification} from "@/features/layout/notification/notification.jsx";

/* Обёртка нужна ради key: при переходе на другой товар форма монтируется заново
   и не тащит в себе данные предыдущего товара. */
export function ProductPage() {
    const {id} = useParams();
    return <ProductForm key={id} id={id}/>;
}

function ProductForm({id}) {
    const navigate = useNavigate();
    const form = useProductForm(id);

    /* заменить зарефакторить переменные на src */
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);

    const photos = useMemo(() => collectPhotos(form.cover, form.variants), [form.cover, form.variants]);
    console.log(photos)
    const activePhoto = activePhotoIndex === null ? null : photos[activePhotoIndex] ?? null;

    const isVariantCover = activePhoto
        ? form.variants.some(variant => variant.name === activePhoto.variantName && activePhoto.src.endsWith(variant.previewImage))
        : false;
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
    };

    const handleMakeVariantCover = (variantIndex, src) => {
        const variantName = form.variants[variantIndex]?.name;

        if (!window.confirm(`Сделать фото обложкой варианта ${variantName}`)) return;

        form.setVariantCover(variantIndex, src);
        setActivePhotoIndex(variantIndex);
    };

    /* ── Динамический расчёт состояния изменений (Badge) ────────────────── */
    const changesBadge = useMemo(() => {
        // Проверяем, изменены ли данные в форме (флаг isDirty из вашего useProductForm)
        if (form.isDirty) {
            return {
                text: "Изменения не сохранены",
                className: "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961] border-none rounded-full px-2.5 py-0.5 text-sm font-medium"
            };
        }
        return {
            text: "Изменений нет",
            className: " bg-[#34C759]/10 h-[40px] text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158] border-none rounded-xl px-2.5 py-0.5 text-sm font-medium"
        };
    }, [form.isDirty]);

    /* ── Разметка ────────────────────────────────────────────────────────── */

    if (!form.item) {
        return (
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
                <div
                    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4">
                    <EmptyState
                        title="Товар не найден"
                        description="Возможно, карточка была удалена или ссылка устарела. Вернитесь в каталог и выберите товар из списка."
                    >
                        <Button
                            className="mt-5 rounded-xl bg-[#007AFF] text-white hover:bg-[#006FE6]"
                            onClick={() => navigate("/products")}
                        >
                            Вернуться в каталог
                        </Button>
                    </EmptyState>
                </div>
            </div>
        );
    }
    console.log(activePhoto);

    return (
        <div className="bg-muted/10 min-h-screen flex flex-col">

            <EntityHeader
                className="border-b"
                backLabel="К товарам"
                title={form.name || "Новый товар"}
                status={
                    <Badge className={changesBadge.className + " hidden sm:flex"}>
                        {changesBadge.text}
                    </Badge>
                }
                actions={[
                    {
                        id: "save",
                        label: "Сохранить",
                        icon: Save,
                        variant: "default",
                        className: "hidden sm:flex",
                        onClick: form.save,
                    },
                ]}
            />

            {/* Контент страницы */}
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-5 p-4 sm:p-5 lg:flex-row flex-1">
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

                {/* Блок справа (Aside) */}
                <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-80">
                    <StatusSection status={form.status} onStatusChange={form.setStatus}/>

                    <NotesSection note={form.note} onNoteChange={form.setNote} MAX_NOTE_LENGTH={100}/>
                    <Badge className={changesBadge.className + "flex sm:hidden"}>
                        {changesBadge.text}
                    </Badge>
                    <Button
                        variant="default"
                        title="Удаление товара"
                        className={"sm:hidden"}
                    >
                        <Save/>
                        Сохранить
                    </Button>
                    <Button
                        variant="destructive"
                        title="Удаление товара"
                    >
                        Удалить товар
                    </Button>
                </aside>
            </div>
            {/* Модалка просмотра изображений */}
            {activePhoto && (
                <PhotoViewer
                    photo={activePhoto}
                    photos={photos}
                    isProductCover={form.cover === activePhoto.src}
                    isVariantCover={isVariantCover}
                    onClose={() => setActivePhotoIndex(null)}
                    onOpenPhoto={openVariantPhoto}
                    onPrev={() => stepPhoto(-1)}
                    onNext={() => stepPhoto(1)}
                    onMakeProductCover={() => handleMakeProductCover(activePhoto.src)}
                    onMakeVariantCover={() => handleMakeVariantCover(activePhoto.variantIndex, activePhoto.src)}
                />
            )}
        </div>
    );
}