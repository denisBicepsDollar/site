import apiFetch from "@/components/shared/api/client.js";

export default async function postSignIn(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: {username, password}
    })
}