import {useState, type ComponentPropsWithoutRef} from "react"
import {VersionSwitcher} from "@/shared/ui/layout/aside/version-switcher.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/shared/ui/layout/aside/sidebar.tsx"
import {PhotoTile} from "@/features/products/product/ui/photo-tile.tsx"

export interface ViewerPhoto {
    src: string
    variantIndex: number | null
    imageIndex: number | null
    variantName: string | null
}

export interface AppSidebarProps extends ComponentPropsWithoutRef<typeof Sidebar> {
    activePhoto?: ViewerPhoto | null
    photos: ViewerPhoto[]
    onOpenPhoto: (variantIndex: number | null, imageIndex: number | null) => void
}

function getGroupKey(photo: ViewerPhoto): string {
    if (photo.variantIndex === null) return "__cover__"
    return `variant:${photo.variantIndex}`
}

function getVariantDisplayLabel(variantName: string | null): string {
    return variantName?.trim() || "Стандарт"
}

export function AppSidebar({
    activePhoto = null,
    onOpenPhoto,
    photos,
    ...props
}: AppSidebarProps) {
    const [selectedVariant, setSelectedVariant] = useState("Все фото")

    const groupMap = new Map<string, {key: string; label: string; selectorLabel: string; items: ViewerPhoto[]}>()
    for (const photo of photos) {
        const key = getGroupKey(photo)
        if (!groupMap.has(key)) {
            const label = key === "__cover__"
                ? "Общие фото"
                : `Вариант ${getVariantDisplayLabel(photo.variantName)}`
            const selectorLabel = key === "__cover__"
                ? "Общие фото"
                : getVariantDisplayLabel(photo.variantName)
            groupMap.set(key, {key, label, selectorLabel, items: []})
        }
        groupMap.get(key)!.items.push(photo)
    }

    const groups = Array.from(groupMap.values())
    const allVersions = ["Все фото", ...groups.map((group) => group.selectorLabel)]
    const effectiveSelectedVariant = allVersions.includes(selectedVariant) ? selectedVariant : "Все фото"

    const visibleGroups = effectiveSelectedVariant !== "Все фото"
        ? groups.filter((group) => group.selectorLabel === effectiveSelectedVariant)
        : groups

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={allVersions}
                    selectedVersion={effectiveSelectedVariant}
                    onSelect={setSelectedVariant}
                />
            </SidebarHeader>
            <SidebarContent>
                {visibleGroups.map((group) => (
                    <SidebarGroup key={group.key} className="items-center">
                        <SidebarGroupLabel>
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-3 items-center">
                                {group.items.map((item, idx) => {
                                    const isActive = activePhoto?.src === item.src
                                        && activePhoto?.variantIndex === item.variantIndex
                                    return (
                                        <SidebarMenuItem key={`${group.key}-${item.variantIndex ?? "cover"}-${item.imageIndex ?? idx}`}>
                                            <PhotoTile
                                                src={item.src}
                                                alt={group.label}
                                                className={isActive ? "ring-2 ring-[#007AFF] dark:ring-[#0A84FF]" : ""}
                                                onOpen={() => onOpenPhoto(item.variantIndex, item.imageIndex)}
                                            />
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
