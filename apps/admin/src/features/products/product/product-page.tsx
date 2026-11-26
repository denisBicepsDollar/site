import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button} from "@site/ui/button";
import {Badge} from "@site/ui/badge";
import {ConfirmDialog} from "@site/ui/confirm-dialog";
import {EmptyState} from "@/shared/ui/EmptyState.tsx";

import {useProductForm} from "./model/useProductForm.ts";
import {collectPhotos, findCoverIndex, findVariantPhotoIndex, stepIndex} from "./model/photos.ts";
import {MAX_NOTE_LENGTH} from "./constants.ts";

import {Save} from 'lucide-react';

import {GeneralInfoSection} from "./components/general-info-section.tsx";
import {DescriptionSection} from "./components/description-section.tsx";
import {PhotosSection} from "./components/photos-section.tsx";
import {VariantsSection} from "./components/variants-section.tsx";
import {StatusSection} from "./components/status-section.tsx";
import {NotesSection} from "@/shared/ui/sections/notes-section.tsx";
import {PhotoViewer} from "./components/photo-viewer.tsx";
import {EntityHeader} from "@/shared/ui/sections/entity-page-header.tsx";

type ConfirmModalState =
    | {kind: "delete-product"}
    | {kind: "delete-photo"; variantIndex: number; imageIndex: number}
    | {kind: "leave-unsaved"}
    | null;

type ActivePhotoTarget = {src: string; variantIndex: number | null} | null;

/* Обёртка нужна ради key: при переходе на другой товар форма монтируется заново
   и не тащит в себе данные предыдущего товара. */
export function ProductPage() {
    const {id} = useParams();
    return <ProductForm key={id ?? "create"} id={id}/>;
}

function ProductForm({id}: {id?: string}) {
    const navigate = useNavigate();
    const location = useLocation();
    const routeFeedback = (location.state as {feedback?: {type: "success" | "error"; text: string}} | null)?.feedback ?? null;
    const form = useProductForm(id);
    const [feedback, setFeedback] = useState<{type: "success" | "error"; text: string} | null>(routeFeedback);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(null);
    const [activePhotoTarget, setActivePhotoTarget] = useState<ActivePhotoTarget>(null);

    useEffect(() => {
        if (!form.hasChanges) return;
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [form.hasChanges]);

    const saveProduct = async () => {
        setFeedback(null);
        try {
            const saved = await form.save();
            if (form.isCreateMode) {
                navigate(`/dashboard/products/${saved.id}`, {
                    replace: true,
                    state: {feedback: {type: "success", text: "Товар создан"}},
                });
            } else {
                setFeedback({type: "success", text: "Изменения сохранены"});
            }
        } catch (error) {
            setFeedback({
                type: "error",
                text: error instanceof Error ? error.message : "Не удалось сохранить товар",
            });
        }
    };

    const performDeleteProduct = async () => {
        setConfirmModal(null);
        setFeedback(null);
        try {
            await form.remove();
            navigate("/dashboard/products", {replace: true});
        } catch (error) {
            setFeedback({
                type: "error",
                text: error instanceof Error ? error.message : "Не удалось удалить товар",
            });
        }
    };

    const photos = useMemo(() => collectPhotos(form.cover, form.variants), [form.cover, form.variants]);
    const activePhotoIndex = useMemo(() => {
        if (!activePhotoTarget) return -1;
        const exact = photos.findIndex(
            (photo) => photo.src === activePhotoTarget.src && photo.variantIndex === activePhotoTarget.variantIndex,
        );
        if (exact !== -1) return exact;
        return photos.findIndex((photo) => photo.src === activePhotoTarget.src);
    }, [activePhotoTarget, photos]);
    const activePhoto = activePhotoIndex >= 0 ? photos[activePhotoIndex] ?? null : null;

    const isVariantCover = activePhoto && activePhoto.variantIndex !== null
        ? form.variants[activePhoto.variantIndex]?.previewImage === activePhoto.src
        : false;

    /* ── Просмотрщик фото ────────────────────────────────────────────────── */
    const openVariantPhoto = (variantIndex: number | null, imageIndex: number | null) => {
        if (variantIndex === null) {
            const idx = findCoverIndex(photos, form.cover);
            const target = idx >= 0 ? photos[idx] : null;
            if (target) setActivePhotoTarget({src: target.src, variantIndex: target.variantIndex});
            return;
        }
        if (imageIndex === null) return;
        const index = findVariantPhotoIndex(photos, variantIndex, imageIndex);
        const target = index !== -1 ? photos[index] : null;
        if (target) setActivePhotoTarget({src: target.src, variantIndex: target.variantIndex});
    };

    const openCoverPhoto = () => {
        const index = findCoverIndex(photos, form.cover);
        const target = index !== -1 ? photos[index] : null;
        if (target) setActivePhotoTarget({src: target.src, variantIndex: target.variantIndex});
    };

    const stepPhoto = (direction: number) => {
        if (!photos.length || activePhotoIndex < 0) return;
        const nextIndex = stepIndex(activePhotoIndex, direction, photos.length);
        const nextPhoto = photos[nextIndex];
        if (nextPhoto) {
            setActivePhotoTarget({src: nextPhoto.src, variantIndex: nextPhoto.variantIndex});
        }
    };

    /* ── Действия с фото ─────────────────────────────────────────────────── */
    const handleRemovePhoto = (variantIndex: number, imageIndex: number) => {
        setConfirmModal({kind: "delete-photo", variantIndex, imageIndex});
    };

    const handleMakeProductCover = (src: string) => {
        form.setProductCover(src);
    };

    const handleMakeVariantCover = (variantIndex: number, src: string) => {
        form.setVariantCover(variantIndex, src);
    };

    const handleBack = () => {
        if (form.hasChanges) {
            setConfirmModal({kind: "leave-unsaved"});
            return;
        }
        navigate("/dashboard/products");
    };

    /* ── Динамический расчёт состояния изменений (Badge) ────────────────── */
    const changesBadge = useMemo(() => {
        if (form.hasChanges) {
            return {
                text: "Изменения не сохранены",
                className: "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961] border-none rounded-full px-2.5 py-0.5 text-sm font-medium"
            };
        }
        return {
            text: "Изменений нет",
            className: "bg-[#34C759]/10 h-[40px] text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158] border-none rounded-xl px-2.5 py-0.5 text-sm font-medium"
        };
    }, [form.hasChanges]);

    /* ── Состояния загрузки и 404 ────────────────────────────────────────── */
    if (form.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-sm text-[#8E8E93]">
                Загружаем карточку товара…
            </div>
        );
    }

    if (form.isError || !form.item) {
        const errorText = form.error instanceof Error
            ? form.error.message
            : "Возможно, карточка была удалена или ссылка устарела. Вернитесь в каталог и выберите товар из списка.";
        return (
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
                <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1C1C1E] p-4">
                    <EmptyState
                        title="Товар не найден"
                        description={errorText}
                    >
                        <Button
                            className="mt-5 rounded-xl bg-[#007AFF] text-white hover:bg-[#006FE6]"
                            onClick={() => navigate("/dashboard/products")}
                        >
                            Вернуться в каталог
                        </Button>
                    </EmptyState>
                </div>
            </div>
        );
    }

    const feedbackBox = feedback && (
        <div
            role={feedback.type === "error" ? "alert" : "status"}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                feedback.type === "error"
                    ? "bg-[#FF3B30]/10 text-[#D70015] dark:bg-[#FF453A]/15 dark:text-[#FF6961]"
                    : "bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]"
            }`}
        >
            {feedback.text}
        </div>
    );

    const confirmConfig = confirmModal?.kind === "delete-product"
        ? {
            title: "Удалить товар?",
            description: `Товар «${form.name || "Без названия"}» будет удалён без возможности восстановления.`,
            confirmLabel: "Удалить",
            destructive: true,
            onConfirm: performDeleteProduct,
        }
        : confirmModal?.kind === "delete-photo"
            ? {
                title: "Удалить фото?",
                description: "Фотография будет удалена из этого варианта товара.",
                confirmLabel: "Удалить",
                destructive: true,
                onConfirm: () => {
                    form.removeVariantPhoto(confirmModal.variantIndex, confirmModal.imageIndex);
                    setActivePhotoTarget(null);
                    setConfirmModal(null);
                },
            }
            : confirmModal?.kind === "leave-unsaved"
                ? {
                    title: "Выйти без сохранения?",
                    description: "Несохранённые изменения карточки товара будут потеряны.",
                    confirmLabel: "Выйти",
                    destructive: true,
                    onConfirm: () => {
                        setConfirmModal(null);
                        navigate("/dashboard/products");
                    },
                }
                : null;

    return (
        <div className="flex min-h-screen flex-col bg-muted/10 print:bg-white">

            <EntityHeader
                className="border-b"
                backLabel="К товарам"
                onBack={handleBack}
                title={form.name || "Новый товар"}
                metadata={null}
                status={
                    <Badge className={changesBadge.className + " hidden sm:flex"}>
                        {changesBadge.text}
                    </Badge>
                }
                actions={[
                    {
                        id: "save",
                        label: form.isSaving ? "Сохранение..." : "Сохранить",
                        icon: Save,
                        variant: "default",
                        disabled: form.isSaving || form.isDeleting,
                        className: "hidden sm:flex",
                        onClick: saveProduct,
                    },
                ]}
            />

            {feedbackBox && (
                <div className="mx-auto mt-4 w-full max-w-screen-2xl px-4 sm:px-5">
                    {feedbackBox}
                </div>
            )}

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
                        categoryOptions={form.categoryOptions}
                        onCategoryChange={form.setCategory}
                        subcategory={form.subcategory}
                        subcategoryOptions={form.subcategoryOptions}
                        onSubcategoryChange={form.setSubcategory}
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
                        uploadError={form.uploadError}
                        onOpenPhoto={openVariantPhoto}
                        onRemovePhoto={handleRemovePhoto}
                        onMakeProductCover={handleMakeProductCover}
                        onCoverUpload={form.uploadCover}
                        onRemoveCover={() => form.setProductCover("")}
                        onOpenCover={openCoverPhoto}
                    />

                    <VariantsSection
                        variants={form.variants}
                        sizePresets={form.sizePresets}
                        uploadError={form.uploadError}
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

                    <NotesSection note={form.note} onNoteChange={form.setNote} MAX_NOTE_LENGTH={MAX_NOTE_LENGTH}/>
                    <Badge className={changesBadge.className + " flex sm:hidden"}>
                        {changesBadge.text}
                    </Badge>
                    {feedbackBox && <div className="sm:hidden">{feedbackBox}</div>}
                    <Button
                        type="button"
                        variant="default"
                        title="Сохранить товар"
                        disabled={form.isSaving || form.isDeleting}
                        className="sm:hidden"
                        onClick={saveProduct}
                    >
                        <Save/>
                        {form.isSaving ? "Сохранение..." : "Сохранить"}
                    </Button>
                    {!form.isCreateMode && (
                        <Button
                            type="button"
                            variant="destructive"
                            title="Удаление товара"
                            disabled={form.isSaving || form.isDeleting}
                            onClick={() => setConfirmModal({kind: "delete-product"})}
                        >
                            {form.isDeleting ? "Удаление..." : "Удалить товар"}
                        </Button>
                    )}
                </aside>
            </div>
            {/* Модалка просмотра изображений */}
            {activePhoto && (
                <PhotoViewer
                    photo={activePhoto}
                    photos={photos}
                    index={activePhotoIndex}
                    total={photos.length}
                    isProductCover={form.cover === activePhoto.src}
                    isVariantCover={isVariantCover}
                    onClose={() => setActivePhotoTarget(null)}
                    onOpenPhoto={openVariantPhoto}
                    onPrev={() => stepPhoto(-1)}
                    onNext={() => stepPhoto(1)}
                    onMakeProductCover={() => handleMakeProductCover(activePhoto.src)}
                    onMakeVariantCover={() => {
                        if (activePhoto.variantIndex !== null) {
                            handleMakeVariantCover(activePhoto.variantIndex, activePhoto.src);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(confirmConfig)}
                onOpenChange={(open) => {
                    if (!open) setConfirmModal(null);
                }}
                title={confirmConfig?.title ?? ""}
                description={confirmConfig?.description ?? ""}
                cancelLabel="Отмена"
                confirmLabel={confirmConfig?.confirmLabel ?? "Продолжить"}
                destructive={Boolean(confirmConfig?.destructive)}
                onConfirm={() => confirmConfig?.onConfirm()}
            />
        </div>
    );
}
