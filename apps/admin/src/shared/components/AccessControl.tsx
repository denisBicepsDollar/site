import {type ReactNode, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";

interface AccessControlProps {
    children: ReactNode;
    type?: "public" | "private";
}

type AuthStatus = "loading" | "authorized" | "unauthorized";

export default function AccessControl({children, type = "private"}: AccessControlProps) {
    const location = useLocation();
    const [authState, setAuthState] = useState<{type: "public" | "private"; status: AuthStatus}>({
        type,
        status: "loading",
    });

    useEffect(() => {
        let active = true;

        async function getValidation() {
            try {
                const res = await fetch("/auth/v1/validation", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                    },
                });
                if (!active) return;
                setAuthState({
                    type,
                    status: res.status === 200 ? "authorized" : "unauthorized",
                });
            } catch {
                if (!active) return;
                setAuthState({type, status: "unauthorized"});
            }
        }

        getValidation();

        const handleUnauthorized = () => {
            if (!active) return;
            setAuthState({type, status: "unauthorized"});
        };

        window.addEventListener("admin:unauthorized", handleUnauthorized);
        return () => {
            active = false;
            window.removeEventListener("admin:unauthorized", handleUnauthorized);
        };
    }, [type]);

    const status: AuthStatus = authState.type === type ? authState.status : "loading";

    if (status === "loading") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#F2F2F7] text-sm font-medium text-[#8E8E93] dark:bg-black dark:text-[#98989D]">
                Проверка сессии...
            </div>
        );
    }

    if (type === "public" && status === "authorized") {
        const rawFrom = (location.state as {from?: unknown} | null)?.from;
        const target = typeof rawFrom === "string" && rawFrom.startsWith("/dashboard")
            ? rawFrom
            : "/dashboard/products";
        return <Navigate to={target} replace />;
    }

    if (type === "private" && status === "unauthorized") {
        return <Navigate to="/" replace state={{from: location.pathname}} />;
    }

    return <>{children}</>;
}
