import {Sidebar as AsideBar} from "@/widgets/sidebar/index";
import {Outlet} from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen w-full min-w-0 bg-[#F2F2F7] text-black dark:bg-black dark:text-white">
            <div className="print:hidden"><AsideBar /></div>
            <main className="relative min-h-full min-w-0 flex-1 dark:bg-black">
                <Outlet />
            </main>
        </div>
    );
}
