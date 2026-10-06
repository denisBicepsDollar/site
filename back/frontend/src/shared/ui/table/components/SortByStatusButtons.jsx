import {data} from "../../../data.js";

export function SortByStatusButtons({currentStatus, setCurrentStatus}) {

    const categories = new Map([['all', data.length]]);

    for (const elem of data) {
        const status = elem.status;
        const currentCount = categories.get(status) || 0
        categories.set(status, currentCount + 1)
    }

    return (<div className="flex flex-1">
        <div className="
            flex
            gap-2
            px-1
            bg-muted/20
            rounded-2xl
            items-center
            ">
            {Array.from(categories).map(([name, count]) => (<div
                    key={name}
                    onClick={() => setCurrentStatus(name)}
                    className={`
                        flex
                        cursor-pointer
                        px-1.5
                        gap-0.5
                        py-0.5
                        rounded-xl
                        items-baseline
                        group
                        transition-all 
                        duration-200 
                        active:scale-98
                        bg-transparent
                        ${currentStatus === name ? "bg-white border-border2 border-2 shadow-sm" : "border-2 border-transparent text-muted/80 hover:bg-muted/5 "}
    
                        `}>
                    <button className={`
                            cursor-pointer
                            flex
                            transition-colors duration-200
                            ${currentStatus === name ? "" : "group-hover:text-black/80"}
                            `}>{name}
                    </button>
                    <span className={`
                                flex
                                px-1.5
                                text-sm
                                font-medium
                                transition-all duration-200
                                ease-out
                                ${currentStatus === name ? "bg-black  text-white " : " group-hover:brightness-110 text-muted/50 bg-muted/20  group-hover:text-black/60 group-hover:bg-muted/40 "}
                                rounded-xl
                                `}>
                                    {count}
                            </span>
                </div>

            ))}
        </div>
    </div>);

}
