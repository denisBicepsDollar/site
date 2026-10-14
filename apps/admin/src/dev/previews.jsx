import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {BrowserRouter} from "react-router-dom";
import AsideBar from "@/features/layout/aside/AsideBar.jsx";
import {ProductPage} from "@/features/products/product/product-page.jsx";
import {ProductListPage} from "@/features/products/product-list-page.jsx";
import Dashboard from "@/features/dashboard/components/Dashboard.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>

            <ComponentPreview>
                <ProductPage/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews