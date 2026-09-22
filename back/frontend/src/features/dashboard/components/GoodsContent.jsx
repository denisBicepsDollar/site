import {SortByStatusButtons, SearchByName, TableRender} from "../../../shared/components/Ui.jsx";

export function GoodsContent() {
    return (
        <div className={`
        h-full
        
        `}>
            <div className={`
            flex
            flex-row
            gap-3
            p-3
            `}>

                <SortByStatusButtons/>
                <SearchByName/>

                <button>eksport</button>
                <button>add tovar</button>
            </div>
            <TableRender/>

        </div>
    );
}