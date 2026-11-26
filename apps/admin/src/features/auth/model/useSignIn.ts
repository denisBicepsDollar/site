import {useMutation} from "@tanstack/react-query";
import {authApi} from "@/shared/api/auth/authApi.ts";

export interface SignInCredentials {
    username: string;
    password: string;
}

export function useSignIn() {
    return useMutation({
            mutationFn: ({username, password}: SignInCredentials) => authApi.postSignIn(username, password),

            onSuccess: () => {
                window.location.href = '/dashboard';
            },
        }
    )
}