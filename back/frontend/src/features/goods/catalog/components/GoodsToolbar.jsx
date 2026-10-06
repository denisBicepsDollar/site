import {Button} from "../../../../shared/ui/Button.jsx";
import {SearchByName} from "../../../../shared/ui/table/components/SearchByName.jsx";
import {SortByStatusButtons} from "../../../../shared/ui/table/components/SortByStatusButtons.jsx";

export function GoodsToolbar({
                                 currentStatus,
                                 setCurrentStatus,
                                 counts,
                                 searchQuery,
                                 setSearchQuery,
                             }) {
    return (
        <>
            <SortByStatusButtons
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
                counts={counts}
            />
            <SearchByName searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <Button text="Экспорт">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-download preview-icon">
                    <path d="M12 15V3"/>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <path d="m7 10 5 5 5-5"/>
                </svg>
            </Button>
            <Button text="Добавить товар" variant="accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-plus preview-icon">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                </svg>
            </Button>
        </>
    );
}