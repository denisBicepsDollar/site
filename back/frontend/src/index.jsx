import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
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
            }
            />
        </Routes>
    </BrowserRouter>
)