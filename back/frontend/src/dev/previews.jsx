import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {GoodPage} from "../features/goods/product/components/GoodPage.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/GoodPage">
                <GoodPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
