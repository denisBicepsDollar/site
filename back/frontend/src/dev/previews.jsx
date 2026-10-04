import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {GoodsContent} from "../features/dashboard/components/GoodsContent.jsx";
import {GoodPage} from "../features/dashboard/components/GoodPage.jsx";
import {BrowserRouter} from "react-router-dom";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/GoodPage">
                <GoodPage/>
            </ComponentPreview>
            <ComponentPreview path="/GoodPage">
                <GoodPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews