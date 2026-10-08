import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "../dev/index.js";
import LoginForm from "../features/auth/components/LoginForm.jsx";
import {ComingSoonPage} from "../features/dashboard/components/ComingSoonPage.jsx";
import Dashboard from "../features/dashboard/components/Dashboard.jsx";
import {OrdersListPage} from "../features/orders/order-content.jsx";
import {GoodsListPage} from "../features/goods/GoodsListPage.jsx";
import {ProductPage} from "../features/goods/product/ProductPage.jsx";
import AccessControl from "@/components/shared/components/AccessControl.jsx";
import {OrderPage} from "@/features/orders/order/order-page.jsx";

export default function App() {
    return (
        <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
            <BrowserRouter>
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
                        <Route index element={<Navigate to="goods" replace/>}/>
                        <Route path="goods">
                            <Route index element={<GoodsListPage/>}/>
                            <Route path=":id" element={<ProductPage/>}/>
                        </Route>
                        <Route path="orders">
                            <Route index element={<OrdersListPage/>}/>
                            <Route path=":id" element={<OrderPage/>}/>
                        </Route>
                        <Route
                            path="messages"
                            element={
                                <ComingSoonPage
                                    title="Обращения"
                                    description="Сообщения клиентов и история ответов."
                                />
                            }
                        />
                        <Route
                            path="settings"
                            element={
                                <ComingSoonPage
                                    title="Настройки"
                                    description="Параметры магазина, доставки, оплаты и уведомлений."
                                />
                            }
                        />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </BrowserRouter>
        </DevSupport>
    );
}