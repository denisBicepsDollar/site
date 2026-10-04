/* ============================================================================
   GOOD PAGE — страница редактирования товара.

   Здесь только «клей»: получить данные из useGoodForm, разложить секции
   и обработать подтверждения. Вся логика — в model/, разметка — в components/.
   ============================================================================ */

import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {PageButton} from "../../shared/components/Ui.jsx";

import {useGoodForm} from "./model/useGoodForm.js";
import {collectPhotos, findCoverIndex, findVariantPhotoIndex, stepIndex} from "./model/photos.js";

import {GoodHeader} from "./components/GoodHeader.jsx";
import {GeneralInfoSection} from "./components/GeneralInfoSection.jsx";
import {DescriptionSection} from "./components/DescriptionSection.jsx";
import {PhotosSection} from "./components/PhotosSection.jsx";
import {VariantsSection} from "./components/VariantsSection.jsx";
import {StatusSection} from "./components/StatusSection.jsx";
import {NotesSection} from "./components/NotesSection.jsx";
import {PhotoViewer} from "./components/PhotoViewer.jsx";

export function GoodPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const form = useGoodForm(id);

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

    if (!form.item) return <div className="p-5">Товар не найден</div>;

    return (
        <div className="bg-muted/10 min-h-screen">
            <GoodHeader
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

                    <PageButton text="Удалить товар" className="bg-red-500 text-white" variant="danger"/>
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
