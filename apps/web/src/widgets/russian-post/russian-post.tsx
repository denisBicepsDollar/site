import {useEffect, useRef} from "react";

export function RussianPost({onSelectAddress}) {

    const widgetRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.pochta.ru/map/widget/widget.js";
        script.async = true;

        script.onload = () => {
            window.callbackAddress = (data) => {
                if (onSelectAddress) onSelectAddress(data);
                console.log("selected address:", data);
            };

            if (window.ecomStartWidget && widgetRef.current) {
                window.ecomStartWidget({
                    id: "",
                    callbackFunction: window.callbackAddress,
                    containerId: "ecom-widget",
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            delete window.callbackAddress;
        };
    }, [onSelectAddress]);

    return <div id="ecom-widget" ref={widgetRef} style={{height: 500}}/>;
}