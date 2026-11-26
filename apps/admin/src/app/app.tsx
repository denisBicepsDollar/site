import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "../dev/index.ts";
import LoginForm from "../features/auth/components/LoginForm.tsx";
import Dashboard from "../features/dashboard/components/Dashboard.tsx";
import {OrdersListPage} from "../features/orders/order-list-page.tsx";
import {ProductPage} from "../features/products/product/product-page.tsx";
import AccessControl from "@/shared/components/AccessControl.tsx";
import {OrderPage} from "@/features/orders/detail/order-page.tsx";
import {MessagesListPage} from "@/features/messages/message-content.tsx";
import SettingsPage from "@/features/settings/settings-content.tsx";
import {ProductListPage} from "@/features/products/product-list-page.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <AccessControl key="public" type="public">
                                <LoginForm/>
                            </AccessControl>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <AccessControl key="login" type="public">
                                <LoginForm/>
                            </AccessControl>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <AccessControl key="private" type="private">
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
                            <Route path=":id" element={<MessagesListPage/>}/>
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