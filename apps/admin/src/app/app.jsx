import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "../dev/index.js";
import LoginForm from "../features/auth/components/LoginForm.jsx";
import Dashboard from "../features/dashboard/components/Dashboard.jsx";
import {OrdersListPage} from "../features/orders/order-list-page.jsx";
import {ProductPage} from "../features/products/product/product-page.jsx";
import AccessControl from "@/shared/components/AccessControl.jsx";
import {OrderPage} from "@/features/orders/detail/order-page.jsx";
import {MessagesListPage} from "@/features/messages/message-content.jsx";
import SettingsPage from "@/features/settings/settings-content.jsx";
import {ProductListPage} from "@/features/products/product-list-page.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <AccessControl type="public">
                                <LoginForm/>
                            </AccessControl>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <AccessControl type="private">
                                <Dashboard/>
                            </AccessControl>
                        }
                    >
                        <Route index element={<Navigate to="products" replace/>}/>
                        <Route path="products">
                            <Route index element={<ProductListPage/>}/>
                            <Route path="create" element={<ProductPage/>}/>
                            <Route path=":id" element={<ProductPage/>}/>
                        </Route>
                        <Route path="orders">
                            <Route index element={<OrdersListPage/>}/>
                            <Route path=":id" element={<OrderPage/>}/>
                        </Route>
                        <Route path="messages">
                            <Route index element={<MessagesListPage/>}/>
                            <Route path=":id" element={<div>21</div>}/>
                        </Route>
                        <Route path="settings">
                            <Route index element={<SettingsPage/>}/>
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </DevSupport>
        </BrowserRouter>
    );
}