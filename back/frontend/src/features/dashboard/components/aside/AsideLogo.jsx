import icon from '/icon.png'

// Логотип магазина
export default function AsideLogo() {
    return (
        <div className="
                        rounded-2xl
                        flex
                        justify-center
                        transition-all
                        duration-150
                        ease-out
                        shrink-0


                        ">
            <img
                src={icon}
                alt="icon"
                className=" w-11 border-accent2 border-2 rounded-3xl"/>
        </div>
    );
}
