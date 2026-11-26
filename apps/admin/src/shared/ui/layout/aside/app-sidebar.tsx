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
import {useState} from "react";
import {PhotoTile} from "@/features/products/product/ui/photo-tile.tsx";

export function AppSidebar({
                               onOpenPhoto,
                               photos,
                               ...props
                           }) {

    const [selectedVariant, setSelectedVariant] = useState('Все фото')
    const variantKeys = Array.from(new Set(photos.map(p => p.variantName ?? '__cover__')));
    const keyToLabel = (key) => key === '__cover__' ? 'Общие фото' : key;
    const allVariants = ['Все фото', ...variantKeys.map(keyToLabel)];

    const activeVariantKeys = selectedVariant !== 'Все фото'
        ? variantKeys.filter(key => keyToLabel(key) === selectedVariant)
        : variantKeys;

    const groups = activeVariantKeys.map(key => {
        const filteredPhotos = photos.filter(photo => (photo.variantName ?? '__cover__') === key);
        return {
            key,
            label: key === '__cover__' ? 'Общие фото' : `Размер ${key}`,
            items: filteredPhotos.map((p) => ({
                src: p.src,
                variantIndex: p.variantIndex,
                imageIndex: p.imageIndex,
            })),
        };
    });

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={allVariants}
                    selectedVersion={selectedVariant}
                    onSelect={setSelectedVariant}
                />
            </SidebarHeader>
            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.key} className="items-center">
                        <SidebarGroupLabel>
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-3 items-center">
                                {group.items.map(({src, imageIndex, variantIndex}, idx) => (
                                    <SidebarMenuItem key={`${group.key}-${variantIndex ?? 'cover'}-${imageIndex ?? idx}`}>
                                        <PhotoTile
                                            src={src}
                                            alt={src}
                                            onOpen={() => onOpenPhoto(variantIndex, imageIndex)}
                                        />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
