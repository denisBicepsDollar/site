import {useNavigate} from "react-router-dom";
import { useState} from "react";
import postSignIn from "../authApi.js";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    async function handleClick(e) {
        e.preventDefault();
        try {
            setError("");
            await postSignIn(username, password);
            window.location.href = '/dashboard';
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div
            className="
            min-h-screen
            flex
            justify-center
            items-center">
            <form
                className="
                w-min
                h-min
                border border-gray-300 rounded px-3 py-2">
                <div
                    className="
                    p-10">
                    <h3
                        className="
                        text-4xl">
                        Авторизация
                    </h3>
                </div>
                <div
                    className="
                    flex
                    flex-col
                    gap-3
                ">
                    <div
                        className="
                        flex
                        flex-col
                        gap-2
                        text-center">
                        <label
                            htmlFor="username">
                            Введите логин
                        </label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2"
                            id="username"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div
                        className="
                        flex
                        flex-col
                        gap-2
                        text-center
                        ">

                        <label
                            htmlFor="password">
                            Введите пароль
                        </label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div
                        className="
                        flex
                        justify-center
                        items-center
                        flex-col
                        gap-2">
                        {error &&
                            <p
                                className="--af-danger">
                                {error}
                            </p>
                        }
                        <button
                            className="btn-accent min-w-1/2"
                            id="submit"
                            disabled={!username || !password}
                            type="submit"
                            onClick={handleClick}>
                            Войти
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};