export function PageHeader({title, description, summary}) {
    return (
        <header className="pt-8 pb-5">
            <div className="flex lg:items-baseline flex-col  gap-2 sm:flex-row sm:items-end sm:gap-4">
                <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.045em] text-[#1C1C1E] dark:text-white sm:text-[25px]">
                    {title}
                </h1>

                <span className="mb-0.5 hidden h-8 w-px shrink-0 rounded-full bg-[#D1D1D6] dark:bg-[#48484A] sm:block"/>

                <p className="text-[15px] text-center leading-5 font-normal text-[#8E8E93] dark:text-[#98989D]">
                    {description}
                </p>
            </div>

            {summary && (
                <div className="mt-4">
                    <div
                        className="inline-flex min-h-8 items-center rounded-full border border-black/[0.05] bg-white/75 px-3 py-1 text-[13px] text-[#6E6E73] shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.08] dark:text-[#AEAEB2]">
                        {summary}
                    </div>
                </div>
            )}

        </header>
    )
}