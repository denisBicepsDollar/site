import {Sidebar as AsideBar} from "@/widgets/sidebar/index";
import {Outlet} from "react-router-dom";
import {Notification} from "@/features/layout/notification/notification.tsx";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen w-full min-w-0 bg-[#F2F2F7] text-black dark:bg-black dark:text-white">
            <AsideBar />
            <main className="relative min-h-full min-w-0 flex-1 dark:bg-black">
                <div className="fixed right-4 top-4 z-40">
                    <Notification />
                </div>
                <Outlet />
            </main>
        </div>
    );
}