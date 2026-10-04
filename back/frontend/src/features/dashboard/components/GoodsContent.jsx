import {useState} from "react";
import {Download, Plus} from "lucide-react";
import {PageButton} from "../../../shared/components/PageButton.jsx";
import {GoodsStatusFilter} from "../../goods/components/GoodsStatusFilter.jsx";
import {GoodsSearch} from "../../goods/components/GoodsSearch.jsx";
import {GoodsTable} from "../../goods/components/GoodsTable.jsx";
import {HeaderInfo} from "./HeaderInfo.jsx";

export function GoodsContent() {
    const [currentStatus, setCurrentStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="h-full px-50">
            <HeaderInfo/>

            <div className="flex flex-row gap-3 pt-4">
                <GoodsStatusFilter value={currentStatus} onChange={setCurrentStatus}/>
                <GoodsSearch value={searchQuery} onChange={setSearchQuery}/>

                <PageButton text='Экспорт'>
                    <Download className="preview-icon" aria-hidden="true"/>
                </PageButton>

                <PageButton text='Добавить товар' variant='accent'>
                    <Plus className="preview-icon" aria-hidden="true"/>
                </PageButton>
            </div>

            <GoodsTable status={currentStatus} query={searchQuery}/>
        </div>
    );
}
