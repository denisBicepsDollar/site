import {Separator} from "@/shared/ui/display/separator.jsx";

export function PageHeader({title, description, summary}) {
    console.log(summary);
    return (
        <header className="w-max min-w-max pt-8">
            <div className="flex lg:items-baseline flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.045em] text-[#1C1C1E] dark:text-white sm:text-[25px]">
                    {title}
                </h1>

                <Separator orientation={'vertical'}/>

                <p className="text-[15px] text-center leading-5 font-normal text-[#8E8E93] dark:text-[#98989D]">
                    {description}
                </p>
            </div>
        </header>
    )
}