import {useRef, useState, type FormEvent} from "react";
import {Eye, EyeOff} from "lucide-react";
import {useSignIn} from "@/features/auth/model/useSignIn.ts";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const {mutate, error, isError, isPending, reset} = useSignIn();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const rawUsername = usernameRef.current?.value ?? username;
        const rawPassword = passwordRef.current?.value ?? password;
        const submittedUsername = rawUsername.trim();

        if (!submittedUsername || !rawPassword) {
            setValidationError("Введите логин и пароль");
            return;
        }

        if (rawUsername !== username) setUsername(rawUsername);
        if (rawPassword !== password) setPassword(rawPassword);

        setValidationError(null);
        mutate({username: submittedUsername, password: rawPassword});
    }

    const displayError = validationError ?? (isError ? error.message : null);

    return (
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex justify-center items-center p-4">
            <form
                onSubmit={handleSubmit}
                noValidate
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
                            ref={usernameRef}
                            className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F2F2F7]/60 dark:bg-[#2C2C2E] px-3 text-sm text-[#1C1C1E] dark:text-white outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                            id="username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (validationError) setValidationError(null);
                                if (isError) reset();
                            }}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-[#3C3C43] dark:text-[#AEAEB2]">
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#F2F2F7]/60 dark:bg-[#2C2C2E] pl-3 pr-10 text-sm text-[#1C1C1E] dark:text-white outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20"
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (validationError) setValidationError(null);
                                    if (isError) reset();
                                }}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-[#1C1C1E] dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                    </div>

                    {displayError && (
                        <p
                            role="alert"
                            className="rounded-xl bg-[#FF3B30]/10 px-3 py-2 text-center text-sm font-medium text-[#D70015] dark:text-[#FF6961]"
                        >
                            {displayError}
                        </p>
                    )}

                    <button
                        className="btn-accent mt-1 w-full"
                        id="submit"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? "Вход..." : "Войти"}
                    </button>
                </div>
            </form>
        </div>
    );
}
