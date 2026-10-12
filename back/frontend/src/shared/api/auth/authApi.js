import {authClient} from "@/shared/api/auth/authClient.js";

export const authApi = {
    postSignIn: (username, password) => authClient.post('/login', {username, password}),
}