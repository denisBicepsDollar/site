import {useLocation} from "react-router-dom";

export function HeaderInfo() {
    const location = useLocation();
    const titles = {
        '/dashboard/goods' : {
            name : 'Товары',
            description : 'Каталог, варианты и остатки'
        },
        '/dashboard/orders' : {
            name: 'Заказы',
            description: 'Продажи, статусы и доставка'
        },
        '/dashboard/messages' : {
            name: 'Обращения',
            description: 'в'
        },
        '/dashboard/settings' : {
            name: 'Настройки',
            description: 'Магазин, доставка, оплата, уведомления'
        }
    }
    const currentTitle = titles[location.pathname]
    return (
        <div className={`
            flex
            flex-row
            bg-stone-100     
            border-b-2
            p-4
            px-8
            border-border2
            items-end
        `}>
            <div className={`
                flex
                flex-col
                w-full
                
            `}>
                <div className={`
                    flex 
                    items-center
                    
                    pb-1
                    
                    `}>
                    <div className={`
                        flex 
                        
                        w-full
                        gap-5
                        items-baseline
                        
                        
                        `}>
                        <h3 className={"font-medium text-2xl leading-none tracking-tighter"}>
                                {currentTitle.name}
                        </h3>
                        <div className={`
                             relative
                             top-1
                             w-[2px] h-6 bg-muted rounded-lg
                        `}>

                        </div>
                        <p className={"text-muted text-xl font-light leading-none tracking-tighter"}>
                                {currentTitle.description}
                        </p>

                    </div>
                </div>

                <div className={`
                    flex
                    items-center
                   
                    justify-baseline
                    font-normal text-lg leading-5
                `}>
                    8 позиций · 5 активных · 1 заканчиваются
                </div>

            </div>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="text-muted
                                 cursor-pointer
                                 w-9
                                 h-9
                                 transition-all
                                 duration-150
                                 ease-out
                                 hover:scale-102 hover:brightness-110
                                 active:scale-98
                                 rendering-geometric
                                 hover:bg-blue-600/80
                                 hover:text-white
                                 rounded-xl

                                 border-2 border-border2
                                 p-1">
                    <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                    <path
                        d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                </svg>
            </button>
        </div>
    );
}