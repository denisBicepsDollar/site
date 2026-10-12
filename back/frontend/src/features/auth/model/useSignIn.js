import {useMutation} from "@tanstack/react-query";
import {authApi} from "@/shared/api/auth/authApi.js";

export function useSignIn() {
    return useMutation(
        {
            mutationFn: ({username, password}) => authApi.postSignIn(username, password),

            onSuccess: () => {
                window.location.href = '/dashboard';
            },
        }
    )
}