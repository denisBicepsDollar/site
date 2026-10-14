import * as React from "react"

import {VersionSwitcher} from "@/shared/ui/layout/aside/version-switcher.jsx"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/shared/ui/layout/aside/sidebar.jsx"
import {useState} from "react";
import {PhotoTile} from "@/features/products/product/ui/photo-tile.jsx";

export function AppSidebar({
                               activePhoto,
                               isProductCover,
                               isVariantCover,
                               onOpenPhoto,
                               photos,
                               ...props
                           }) {

    const [selectedVariant, setSelectedVariant] = useState('Все фото')
    const variantsNames = new Set(photos.map(p => p.variantName));
    const variantsArray = [...variantsNames];
    console.log(variantsArray);
    const allVariants = ['Все фото', ...variantsArray]

    const activeVariant = selectedVariant !== 'Все фото'
        ? variantsArray.filter(variant => variant === selectedVariant)
        : variantsArray;

    const data = activeVariant.map(variantName => {

        const filteredPhotos = photos.filter(photo => photo.variantName === variantName);

        const photoInfo = filteredPhotos.map(p => ({
            src: p.src,
            variantIndex: p.variantIndex,
            imageIndex: p.imageIndex,
        }));

        return {
            [variantName]: [...photoInfo]

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
                {data.map((item) => {
                    const [variantName, photosArray] = Object.entries(item)[0];
                    return <SidebarGroup key={variantName} className="items-center">
                        <SidebarGroupLabel>
                            Размер {variantName}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-3 items-center">
                                {
                                    photosArray.map(({src, imageIndex, variantIndex}) => {
                                        return <SidebarMenuItem key={src}>
                                            <PhotoTile
                                                src={src}
                                                alt={src}
                                                onOpen={() => onOpenPhoto(variantIndex, imageIndex)}
                                            />
                                        </SidebarMenuItem>
                                    })
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                })}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
