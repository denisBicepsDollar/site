import {authClient} from "@/shared/api/auth/authClient.ts";

export const authApi = {
    postSignIn: (username: string, password: string) => authClient.post('/login', {username, password}),
    logout: () => authClient.post('/logout'),
    validate: () => authClient.get('/validation'),
};
