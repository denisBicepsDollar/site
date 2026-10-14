import AsideBar from "@/features/layout/aside/AsideBar.jsx";
import {Outlet} from "react-router-dom";
import {Notification} from "@/features/layout/notification/notification.jsx";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen w-full  min-w-0bg-[#F2F2F7] dark:bg-black text-black dark:text-white ">
            <AsideBar/>
            <main className="flex-1 min-w-0 min-h-full dark:bg-black">
                <Outlet/>

            </main>
        </div>
    );
}