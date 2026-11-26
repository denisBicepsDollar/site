import {Separator} from "@site/ui/separator";
// import {Notification} from "@/features/layout/notification/notification.tsx";

export function PageHeader({title, description}) {
    return (
        <header className="flex w-full items-start justify-between gap-4 pt-6 pl-14 md:pl-0">
            <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                <h1 className="text-[26px] leading-[1.1] font-semibold text-[#1C1C1E] dark:text-white sm:text-[28px]">
                    {title}
                </h1>

                <Separator orientation="vertical" className="hidden h-5 sm:block"/>

                <p className="text-[14px] leading-5 font-normal text-[#8E8E93] dark:text-[#98989D]">
                    {description}
                </p>
            </div>

            {/* <div className="shrink-0 print:hidden">
                <Notification />
            </div> */}
        </header>
    )
}
