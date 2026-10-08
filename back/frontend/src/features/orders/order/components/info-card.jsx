import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";

export function InfoCard({icon: Icon, title, children, className = ""}) {
    return (
        <Card
            className={`min-w-0 rounded-[20px] border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#1C1C1E] ${className}`}
        >
            <CardHeader className="p-4 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1E] dark:text-white">
                    <Icon className="size-4 text-[#8E8E93]"/>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">{children}</CardContent>
        </Card>
    )
}
