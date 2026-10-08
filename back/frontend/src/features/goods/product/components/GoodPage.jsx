import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx"

import {useProductForm} from "../model/useProductForm.js";
import {collectPhotos, findCoverIndex, findVariantPhotoIndex, stepIndex} from "../model/photos.js";

import {ProductHeader} from "./ProductHeader.jsx";
import {GeneralInfoSection} from "./GeneralInfoSection.jsx";
import {DescriptionSection} from "./DescriptionSection.jsx";
import {PhotosSection} from "./PhotosSection.jsx";
import {VariantsSection} from "./VariantsSection.jsx";
import {StatusSection} from "./StatusSection.jsx";
import {NotesSection} from "../../../../components/ui/notes-section.jsx";
import {PhotoViewer} from "./PhotoViewer.jsx";


import {ConfirmDialog} from "@/components/ui/confirm-dialog.jsx"

/* Обёртка нужна ради key: при переходе на другой товар форма монтируется заново
   и не тащит в себе данные предыдущего товара. */
export function GoodPage() {
    const {id} = useParams();

    return <GoodForm key={id} id={id}/>;
}

function GoodForm({id}) {
    const navigate = useNavigate();
    const form = useProductForm(id);
    const [confirmRequest, setConfirmRequest] = useState(null)

    const askConfirm = (request) => setConfirmRequest(request)

    const runConfirm = () => {
        const action = confirmRequest?.onConfirm
        setConfirmRequest(null)
        action?.()
    }

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
        askConfirm({
            title: "Удалить фото?",
            description: "Фото будет удалено из этого варианта.",
            confirmText: "Удалить",
            destructive: true,
            onConfirm: () => {
                form.removeVariantPhoto(variantIndex, imageIndex)
                setActivePhotoIndex(null)
            },
        })
    }

    const handleMakeProductCover = (src) => {
        askConfirm({
            title: "Сделать обложкой товара?",
            description: "Это фото будет отображаться как основная обложка товара.",
            confirmText: "Сделать обложкой",
            onConfirm: () => {
                form.setProductCover(src)
                setActivePhotoIndex(null)
            },
        })
    }

    const handleMakeVariantCover = (variantIndex, src) => {
        const variantName = form.variants[variantIndex]?.name

        askConfirm({
            title: "Сделать обложкой варианта?",
            description: `Фото станет обложкой варианта «${variantName}».`,
            confirmText: "Сделать обложкой",
            onConfirm: () => {
                form.setVariantCover(variantIndex, src)
                setActivePhotoIndex(null)
            },
        })
    }

    /* ── Разметка ────────────────────────────────────────────────────────── */

    if (!form.item) return <div className="p-5">Товар не найден</div>;

    return (
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
            <ProductHeader
                name={form.name}
                hasChanges={form.hasChanges}
                onBack={() => navigate(-1)}
                onSave={form.save}
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

                    <NotesSection note={form.note} onNoteChange={form.setNote}/>

                    <Button
                        variant="destructive"
                        className="h-11 w-full rounded-[14px]"
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
            <ConfirmDialog
                open={Boolean(confirmRequest)}
                onOpenChange={(open) => {
                    if (!open) setConfirmRequest(null)
                }}
                title={confirmRequest?.title}
                description={confirmRequest?.description}
                cancelLabel="Отмена"
                confirmLabel={confirmRequest?.confirmText ?? "Продолжить"}
                destructive={Boolean(confirmRequest?.destructive)}
                onConfirm={runConfirm}
            />
        </div>
    );
}