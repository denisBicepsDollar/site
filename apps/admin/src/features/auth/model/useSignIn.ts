import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {authApi} from "@/shared/api/auth/authApi.ts";

export interface SignInCredentials {
    username: string;
    password: string;
}

export function useSignIn() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({username, password}: SignInCredentials) => authApi.postSignIn(username, password),
        onSuccess: () => {
            navigate('/dashboard', {replace: true});
        },
    });
}
