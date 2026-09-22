import AsidePanel from "./AsidePanel.jsx";
import {Outlet} from 'react-router-dom';
import {HeaderInfo} from "./HeaderInfo.jsx";


export default function Dashboard() {


    return (
        <div className={"flex overflow-hidden h-screen w-full"}>
            <AsidePanel/>
            <main className={"w-full min-h-screen overflow-y-auto"}>
                <HeaderInfo/>
                <Outlet/>
            </main>
        </div>
    );
}