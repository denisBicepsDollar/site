import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useLocation, useNavigate} from "react-router-dom";
import {authApi} from "@/shared/api/auth/authApi.ts";

export interface SignInCredentials {
    username: string;
    password: string;
}

export function resolvePostSignInPath(state: unknown): string {
    const rawFrom = (state as {from?: unknown} | null)?.from;
    return typeof rawFrom === "string" && rawFrom.startsWith("/dashboard")
        ? rawFrom
        : "/dashboard/products";
}

export function useSignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({username, password}: SignInCredentials) => authApi.postSignIn(username, password),
        onSuccess: () => {
            queryClient.clear();
            navigate(resolvePostSignInPath(location.state), {replace: true});
        },
    });
}
