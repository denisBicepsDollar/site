import {AsideButton} from '../../../../shared/components/Ui.jsx'
import {ShopIcon} from "./icons.jsx";

// Ссылка на витрину магазина
export default function AsideShopLink() {
    return (
        <AsideButton
            to="localhost"
            className="whitespace-nowrap overflow-hidden"
            text={"Перейти в магазин"}>
            <div className="

                            p-2
                            ">
                <ShopIcon/>
            </div>
        </AsideButton>
    );
}
