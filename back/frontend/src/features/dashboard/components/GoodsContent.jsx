import {SortByStatusButtons, SearchByName, TableRender} from "../../../shared/components/Ui.jsx";
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

                <button>eksport</button>
                <button>add tovar</button>
            </div>
            <TableRender/>

        </div>
    );
}