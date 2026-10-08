import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {GoodsListPage} from "@/features/goods/GoodsListPage.jsx";
import {BrowserRouter} from "react-router-dom";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>

            <ComponentPreview path="/GoodsListPage">
                <GoodsListPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews