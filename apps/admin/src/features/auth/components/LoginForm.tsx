import {useState, type FormEvent} from "react";
import {useSignIn} from "@/features/auth/model/useSignIn.ts";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {mutate, error, isError, isPending} = useSignIn();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        mutate({username, password});
    }

    return (
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex justify-center items-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-6 shadow-sm"
            >
                <div className="mb-6 text-center">
                    <h3 className="text-2xl font-semibold text-[#1C1C1E] dark:text-white">
                        Авторизация
                    </h3>
                    <p className="mt-1 text-sm text-[#8E8E93]">
                        Вход в панель управления «Зелёные усы»
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="username" className="text-sm font-medium text-[#3C3C43] dark:text-[#AEAEB2]">
                            Логин
                        </label>
                        <input
                            className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-[#F2F2F7]/60 dark:bg-[#2C2C2E] px-3 text-sm text-[#1C1C1E] dark:text-white outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                            id="username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-[#3C3C43] dark:text-[#AEAEB2]">
                            Пароль
                        </label>
                        <input
                            className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-[#F2F2F7]/60 dark:bg-[#2C2C2E] px-3 text-sm text-[#1C1C1E] dark:text-white outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {isError && (
                        <p
                            role="alert"
                            className="rounded-xl bg-[#FF3B30]/10 px-3 py-2 text-center text-sm font-medium text-[#D70015] dark:text-[#FF6961]"
                        >
                            {error.message}
                        </p>
                    )}

                    <button
                        className="btn-accent mt-1 w-full"
                        id="submit"
                        disabled={!username || !password || isPending}
                        type="submit"
                    >
                        {isPending ? "Вход..." : "Войти"}
                    </button>
                </div>
            </form>
        </div>
    );
}
