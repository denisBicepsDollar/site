"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/actions/dropdown-menu.tsx"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/shared/ui/layout/aside/sidebar.tsx"
import {GalleryVerticalEndIcon, ChevronsUpDownIcon, CheckIcon} from "lucide-react"

export interface VersionSwitcherProps {
    versions: string[]
    selectedVersion: string
    onSelect: (version: string) => void
}

export function VersionSwitcher({
    versions,
    selectedVersion,
    onSelect,
}: VersionSwitcherProps) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                            >
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEndIcon className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Галерея</span>
                                    <span className="">
                                        {selectedVersion}
                                    </span>
                                </div>
                                <ChevronsUpDownIcon className="ml-auto"/>
                            </SidebarMenuButton>
                        }
                    />

                    <DropdownMenuContent align="start">
                        {versions.map((version) => (
                            <DropdownMenuItem
                                key={version}
                                onClick={() => onSelect(version)}
                            >
                                {version}
                                {version === selectedVersion && (
                                    <CheckIcon className="ml-auto"/>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
