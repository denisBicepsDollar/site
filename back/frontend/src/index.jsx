import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./features/dashboard/components/Dashboard.jsx";
import AccessControl from "./shared/components/AccessControl.jsx";
import LoginForm from "./features/auth/components/LoginForm.jsx";

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
                <Route path="goods" element={<span>товары</span>}/>
                <Route path="orders" element={<span>заказы</span>}/>
                <Route path="messages" element={<span>обращения</span>}/>
                <Route path="settings" element={<span>настройки</span>}/>
                <Route path="localhost" element={<span>перейти в магазин</span>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)