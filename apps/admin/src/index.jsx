import {createRoot} from "react-dom/client";
import App from "./app/app.jsx";
import "./index.css";
import {StrictMode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/app/queryClient.js";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </StrictMode>
);
