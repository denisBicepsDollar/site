import {Clock3} from "lucide-react";
import {EmptyState} from "../../../shared/components/ui/EmptyState.jsx";
import {PageHeader} from "./PageHeader.jsx";

export function ComingSoonPage({title, description}) {
    return (
        <div
            className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <PageHeader title={title} description={description}/>
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/[0.02]">
                <EmptyState
                    icon={Clock3}
                    title="Раздел готовится"
                    description="Структура панели уже на месте. Наполнение этого раздела можно подключить отдельно, когда появятся данные и бизнес-правила."
                />
            </section>
        </div>
    );
}