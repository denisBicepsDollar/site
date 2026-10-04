import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./features/dashboard/components/Dashboard.jsx";
import AccessControl from "./shared/components/AccessControl.jsx";
import LoginForm from "./features/auth/components/LoginForm.jsx";
import {GoodsContent} from "./features/dashboard/components/GoodsContent.jsx";
import {OrdersContent} from "./features/dashboard/components/OrdersContent.jsx";
import {GoodPage} from "./features/dashboard/components/GoodPage.jsx";

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={
                <AccessControl type="public">
                    <LoginForm />
                </AccessControl>
                }
            />
            <Route
                path="/dashboard"
                element={
                <AccessControl type="private">
                    <Dashboard />
                </AccessControl>
            }>
                <Route index element={<Navigate to="goods" replace />} />
                <Route path="goods">
                    <Route index element={<GoodsContent />}/>
                    <Route path=":id" element={<GoodPage />}/>
                </Route>

                <Route path="orders" element={<OrdersContent/>}/>
                <Route path="messages" element={<span>обращения</span>}/>
                <Route path="settings" element={<span>настройки</span>}/>
                <Route path="localhost" element={<span>перейти в магазин</span>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)