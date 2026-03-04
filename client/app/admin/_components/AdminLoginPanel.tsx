import { FormEvent } from "react";

interface AdminLoginPanelProps {
    email: string;
    password: string;
    loading: boolean;
    error: string | null;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
}

export function AdminLoginPanel({
    email,
    password,
    loading,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: AdminLoginPanelProps) {
    return (
        <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8 space-y-6">
                <h1 className="text-2xl font-semibold text-zinc-900">Админка графа</h1>
                <p className="text-sm text-zinc-500">
                    Войдите с помощью Laravel-аккаунта, чтобы управлять нодами и связями.
                </p>

                {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-zinc-700">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                            value={email}
                            onChange={(event) => onEmailChange(event.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-zinc-700">Пароль</label>
                        <input
                            type="password"
                            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                            value={password}
                            onChange={(event) => onPasswordChange(event.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-zinc-900 text-white py-2 text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Входим..." : "Войти"}
                    </button>
                </form>
            </div>
        </main>
    );
}
