import {Tabs as TabsPrimitive} from "@base-ui/react/tabs"
import {cva} from "class-variance-authority"
import {cn} from "cn"

function Tabs({className, orientation = "horizontal", ...props}) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn(
                "group/tabs flex gap-2 font-sans data-horizontal:flex-col",
                className,
            )}
            {...props}
        />
    )
}

const tabsListVariants = cva(
    "group/tabs-list inline-flex w-fit items-center justify-center gap-1 rounded-[14px] p-1 text-[13px] text-[#6E6E73] group-data-horizontal/tabs:h-11 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none data-[variant=line]:p-0",
    {
        variants: {
            variant: {
                default:
                    "border border-black/[0.04] bg-[#F2F2F7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#1C1C1E] dark:shadow-none",
                line: "gap-1 border-0 bg-transparent shadow-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

function TabsList({className, variant = "default", ...props}) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({variant}), className)}
            {...props}
        />
    )
}

function TabsTrigger({className, ...props}) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn(
                "relative inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-transparent px-3 py-1 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap text-[#6E6E73] transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/35 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-[#98989D] dark:focus-visible:ring-[#0A84FF]/40 dark:hover:text-white data-active:bg-white data-active:text-[#1C1C1E] data-active:shadow-[0_1px_3px_rgba(0,0,0,0.14)] dark:data-active:bg-[#3A3A3C] dark:data-active:text-white dark:data-active:shadow-[0_1px_3px_rgba(0,0,0,0.25)] group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:text-[#007AFF] dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:text-[#0A84FF] after:absolute after:bg-[#007AFF] after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-2 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 dark:after:bg-[#0A84FF] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    )
}

function TabsContent({className, ...props}) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn("flex-1 text-sm outline-none", className)}
            {...props}
        />
    )
}

export {Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants}