import AsideBar from "../../aside/AsideBar.jsx";
import {Outlet} from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
            <AsideBar/>
            <main className="min-w-0 flex-1">
                <Outlet/>
            </main>
        </div>
    );
}