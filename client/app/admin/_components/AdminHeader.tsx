interface AdminHeaderProps {
    onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
    return (
        <header className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900">Админка графа</h1>
                <p className="text-sm text-zinc-500">
                    Добавление новых нод и связей, удаление существующих нод.
                </p>
            </div>
            <button
                type="button"
                onClick={onLogout}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
            >
                Выйти
            </button>
        </header>
    );
}
