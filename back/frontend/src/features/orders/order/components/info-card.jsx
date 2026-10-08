import {CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {SectionCard} from "@/components/ui/section-card.jsx";
import {cn} from "cn";

export function InfoCard({icon: Icon, title, children, className = ""}) {
    return (
        <SectionCard radius={20} className={cn("min-w-0", className)}>
            <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1E] dark:text-white">
                    <Icon className="size-4 text-[#8E8E93]"/>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">{children}</CardContent>
        </SectionCard>
    )
}
