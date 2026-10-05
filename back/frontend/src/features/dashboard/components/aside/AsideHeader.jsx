import AsideBellButton from "./AsideBellButton.jsx";
import AsideLogo from "./AsideLogo.jsx";
import AsideBrandTitle from "./AsideBrandTitle.jsx";
import AsidePinButton from "./AsidePinButton.jsx";

// Верхняя строка панели: уведомления, логотип, название и кнопка закрепления
export default function AsideHeader({isExpanded, isPinned, onTogglePin}) {
    return (
        <div className="

                    flex
                    flex-row
                    ">
            <AsideBellButton/>
            <AsideLogo/>

            <div className="flex gap-4 justify-center items-center">
                <AsideBrandTitle isExpanded={isExpanded}/>
                <AsidePinButton
                    isExpanded={isExpanded}
                    isPinned={isPinned}
                    onTogglePin={onTogglePin}
                />
            </div>
        </div>
    );
}
