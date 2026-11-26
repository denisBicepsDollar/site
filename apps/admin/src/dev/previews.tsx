import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {ProductPage} from "@/features/products/product/product-page.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>

            <ComponentPreview path="src/features/products/product/product-page.tsx">
                <ProductPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews