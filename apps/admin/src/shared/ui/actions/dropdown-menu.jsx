import {Menu as MenuPrimitive} from "@base-ui/react/menu"
import {cn} from "cn"
import {ChevronRightIcon, CheckIcon} from "lucide-react"

function DropdownMenu({...props}) {
    return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({...props}) {
    return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({render, ...props}) {
    return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" render={render}  {...props} />
}

function DropdownMenuContent({
                                 align = "start",
                                 alignOffset = 0,
                                 side = "bottom",
                                 sideOffset = 4,
                                 className,
                                 ...props
                             }) {
    return (
        <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    className={cn(
                        "z-50 max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-[14px] border border-black/[0.06] bg-white/95 p-1.5 text-[#1C1C1E] shadow-[0_12px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04] backdrop-blur-2xl duration-150 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 dark:border-white/[0.08] dark:bg-[#2C2C2E]/95 dark:text-[#F2F2F7] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:ring-white/[0.06]",
                        className,
                    )}
                    {...props}
                />
            </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
    )
}

function DropdownMenuGroup({...props}) {
    return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({className, inset, ...props}) {
    return (
        <MenuPrimitive.GroupLabel
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                "px-2 py-1.5 text-xs font-semibold text-[#8E8E93] data-inset:pl-8",
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuItem({
                              className,
                              inset,
                              variant = "default",
                              ...props
                          }) {
    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-[#1C1C1E] outline-none select-none transition-colors duration-150 focus:bg-[#F2F2F7] focus:text-[#1C1C1E] data-inset:pl-8 data-[variant=destructive]:text-[#FF3B30] data-[variant=destructive]:focus:bg-[#FF3B30]/10 data-[variant=destructive]:focus:text-[#D70015] dark:text-[#F2F2F7] dark:focus:bg-white/[0.1] dark:focus:text-white dark:data-[variant=destructive]:text-[#FF453A] dark:data-[variant=destructive]:focus:bg-[#FF453A]/15 dark:data-[variant=destructive]:focus:text-[#FF453A] data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-[#FF3B30] dark:data-[variant=destructive]:*:[svg]:text-[#FF453A]",
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuSub({...props}) {
    return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
                                    className,
                                    inset,
                                    children,
                                    ...props
                                }) {
    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "flex cursor-default items-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-[#1C1C1E] outline-none select-none transition-colors duration-150 focus:bg-[#F2F2F7] focus:text-[#1C1C1E] data-inset:pl-8 data-popup-open:bg-[#F2F2F7] data-popup-open:text-[#1C1C1E] data-open:bg-[#F2F2F7] data-open:text-[#1C1C1E] dark:text-[#F2F2F7] dark:focus:bg-white/[0.1] dark:focus:text-white dark:data-popup-open:bg-white/[0.1] dark:data-open:bg-white/[0.1] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="ml-auto size-4 text-[#8E8E93]"/>
        </MenuPrimitive.SubmenuTrigger>
    )
}

function DropdownMenuSubContent({
                                    align = "start",
                                    alignOffset = -3,
                                    side = "right",
                                    sideOffset = 0,
                                    className,
                                    ...props
                                }) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            className={cn("w-auto min-w-[96px]", className)}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    )
}

function DropdownMenuCheckboxItem({
                                      className,
                                      children,
                                      checked,
                                      inset,
                                      ...props
                                  }) {
    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-default items-center gap-2 rounded-[10px] py-2 pr-9 pl-2.5 text-[13px] font-medium text-[#1C1C1E] outline-none select-none transition-colors duration-150 focus:bg-[#F2F2F7] focus:text-[#1C1C1E] data-inset:pl-8 data-checked:text-[#007AFF] dark:text-[#F2F2F7] dark:focus:bg-white/[0.1] dark:focus:text-white dark:data-checked:text-[#0A84FF] data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2.5 flex items-center justify-center text-[#007AFF] dark:text-[#0A84FF]"
                data-slot="dropdown-menu-checkbox-item-indicator"
            >
                <MenuPrimitive.CheckboxItemIndicator>
                    <CheckIcon className="size-4 stroke-[2.5]"/>
                </MenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    )
}

function DropdownMenuRadioGroup({...props}) {
    return (
        <MenuPrimitive.RadioGroup
            data-slot="dropdown-menu-radio-group"
            {...props}
        />
    )
}

function DropdownMenuRadioItem({
                                   className,
                                   children,
                                   inset,
                                   ...props
                               }) {
    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-[10px] py-2 pr-9 pl-2.5 text-[13px] font-medium text-[#1C1C1E] outline-none select-none transition-colors duration-150 focus:bg-[#F2F2F7] focus:text-[#1C1C1E] data-inset:pl-8 dark:text-[#F2F2F7] dark:focus:bg-white/[0.1] dark:focus:text-white data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2.5 flex items-center justify-center text-[#007AFF] dark:text-[#0A84FF]"
                data-slot="dropdown-menu-radio-item-indicator"
            >
                <MenuPrimitive.RadioItemIndicator>
                    <CheckIcon className="size-4 stroke-[2.5]"/>
                </MenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    )
}

function DropdownMenuSeparator({className, ...props}) {
    return (
        <MenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn(
                "mx-1 my-1.5 h-px bg-[#E5E5EA] dark:bg-[#38383A]",
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuShortcut({className, ...props}) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                "ml-auto text-xs tracking-wide text-[#8E8E93] group-focus/dropdown-menu-item:text-[#6E6E73] dark:group-focus/dropdown-menu-item:text-[#AEAEB2]",
                className,
            )}
            {...props}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
}