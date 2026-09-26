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
        },
        '/dashboard' : {
            name : '',
            description : '',
        }
    }
    const currentTitle = titles[location.pathname]
    return (
        <>

            <div className={`
                        flex 
                        items-center
                        pt-8
                        pb-0
                        
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
                        pt-3                        
                        `}>
                <div className={`
                        flex
                        items-center
                        text-muted
                        justify-baseline
                        font-normal text-md leading-5
                    `}>
                    8 позиций · 5 активных · 1 заканчиваются
                </div>
            </div>

        </>

    );
}