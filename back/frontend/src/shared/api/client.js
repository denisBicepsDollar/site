const errorTranslations = {
    "No token provided": "Войдите в систему",
    "Invalid token": "Сессия устарела, войдите заново",
    "Invalid username or password": "Неверное имя пользователя или пароль",
    "Too many requests. Please try again later.": "Слишком много попыток. Попробуйте позже.",
    "Something went wrong": "Что-то пошло не так на сервере"
};

export default async function apiFetch( endpoint, options = {} )  {
    const config = {
        method: options.method || 'GET',
        headers:{
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    const res = await fetch( endpoint, config );

    if (!res.ok) {
        let errorMessage = 'Something went wrong';
        try{
            const data = await res.json();
            if (data && data.message){
                errorMessage = data.message;
            }
        } catch (err) {
            console.warn('[apiFetch] Не удалось распарсить JSON ошибки:', err);
        }
        throw new Error(translateError(errorMessage));
    }
    if (res.status === 204) return null;

    return await res.json();
}

function translateError(message) {
    return errorTranslations[message] || message;
}