export default async function postSignIn(username, password) {
    const res = await fetch(
        `/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password,
            }),
        },
    );
    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Неверный логин или пароль");
        }
        throw new Error("Что-то пошло не так");
    }
    return await res.json();
}