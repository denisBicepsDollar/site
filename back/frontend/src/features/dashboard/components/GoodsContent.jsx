import {
    SortByStatusButtons,
    SearchByName,
    TableRender,
    AsideButton,
    PageButton
} from "../../../shared/components/Ui.jsx";
import {HeaderInfo} from "./HeaderInfo.jsx";

export function GoodsContent() {
    return (
        <div className={`
        h-full
        px-50
        `}>
            <HeaderInfo/>
            <div className={`
            flex
            flex-row
            gap-3
            pt-4
            `}>

                <SortByStatusButtons/>
                <SearchByName/>

                <PageButton text='Экспорт'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-download preview-icon">
                        <path d="M12 15V3"/>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <path d="m7 10 5 5 5-5"/>
                    </svg>
                </PageButton>
                <PageButton text='Добавить товар' variant='accent'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-plus preview-icon">
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                </PageButton>
            </div>
            <TableRender/>
        </div>
    );
}