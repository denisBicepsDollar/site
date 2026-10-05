import AsidePanel from "./AsidePanel.jsx";
import {Outlet} from 'react-router-dom';
import {HeaderInfo} from "./HeaderInfo.jsx";


export default function Dashboard() {


    return (
        <div className={"flex overflow-hidden min-h-screen w-full"}>
           
            <main className={"w-full min-h-screen overflow-y-auto"}>
                <div className={`
            `}>
                    <div className={`
                    flex
                    flex-col
                    w-full
                `}>
                    </div>

                </div>
                <Outlet/>
            </main>
        </div>
    );
}