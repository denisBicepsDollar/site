import {cn} from "cn";
import {CardContent} from "@/shared/ui/display/card.jsx";
import {
    SectionCard,
    SectionCardHeader,
} from "@/shared/ui/sections/section-card.jsx";

export function InfoCard({icon: Icon, title, children, className = ""}) {
    return (
        <SectionCard radius={20} className={cn("min-w-0", className)}>
            <SectionCardHeader icon={Icon} title={title}/>
            <CardContent className="px-4 pb-4">{children}</CardContent>
        </SectionCard>
    )
}
