export function PageHeader({title, description, summary}) {
    return (
        <>
            <div className="
                flex
                items-center
                pt-8
                pb-0
            ">
                <div className="
                    flex
                    w-full
                    gap-5
                    items-baseline
                ">
                    <h3 className="font-medium text-2xl leading-none tracking-tighter">
                        {title}
                    </h3>
                    <div className="relative top-1 w-[2px] h-6 bg-muted rounded-lg"/>
                    <p className="text-muted text-xl font-light leading-none tracking-tighter">
                        {description}
                    </p>
                </div>
            </div>

            {summary && (
                <div className="flex items-center pt-3">
                    <div className="
                        flex
                        items-center
                        text-muted
                        justify-baseline
                        font-normal text-md leading-5
                    ">
                        {summary}
                    </div>
                </div>
            )}
        </>
    );
}