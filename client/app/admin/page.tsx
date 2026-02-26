'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";

interface INode {
  id: number;
  code: string;
  title: string;
  type: string;
  type_en: string;
  icon: string | null;
  avatar: string | null;
  short_description: string | null;
  description: string | null;
  position: { x: number; y: number } | null;
}

interface IEdge {
  id: number;
  from_node_id: number;
  to_node_id: number;
  type: string;
  type_en: string;
}

interface IGraphResponse {
  nodes: INode[];
  edges: IEdge[];
}

const NODE_TYPES: { label: string; value: string }[] = [
  { label: "бог", value: "god" },
  { label: "миф", value: "myth" },
  { label: "артефакт", value: "artifact" },
  { label: "место", value: "place" },
  { label: "событие", value: "event" },
  { label: "герой", value: "hero" },
  { label: "демиург", value: "demiurge" },
];

const EDGE_TYPES: { label: string; value: string }[] = [
  { label: "родитель", value: "parent" },
  { label: "ребенок", value: "child" },
  { label: "супруг", value: "spouse" },
  { label: "брат", value: "brother" },
  { label: "враг", value: "enemy" },
  { label: "союзник", value: "ally" },
  { label: "владелец", value: "owns" },
  { label: "участвует", value: "participates" },
  { label: "расположен в", value: "located_in" },
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://127.0.0.1:8000/api";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);

  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<string>(NODE_TYPES[0]?.label ?? "");
  const [newShortDescription, setNewShortDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newX, setNewX] = useState<number>(0);
  const [newY, setNewY] = useState<number>(0);

  const [relationTargetId, setRelationTargetId] = useState<number | "">("");
  const [relationType, setRelationType] = useState<string>(
    EDGE_TYPES[0]?.label ?? "",
  );
  const [relationDirection, setRelationDirection] = useState<
    "from_new" | "to_new"
  >("from_new");

  const [deleteNodeId, setDeleteNodeId] = useState<number | "">("");

  const [editNodeId, setEditNodeId] = useState<number | "">("");
  const [editCode, setEditCode] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<string>(NODE_TYPES[0]?.label ?? "");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editX, setEditX] = useState<number>(0);
  const [editY, setEditY] = useState<number>(0);

  const sortedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.title.localeCompare(b.title)),
    [nodes],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedToken = window.localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void fetchGraph();
  }, [token]);

  const fetchGraph = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/graph`);

      if (!response.ok) {
        throw new Error("Graph request failed");
      }

      const data: IGraphResponse = await response.json();

      setNodes(data.nodes ?? []);
      setEdges(data.edges ?? []);
    } catch (e) {
      setError("Не удалось загрузить граф.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEditNode = (value: string) => {
    if (!value) {
      setEditNodeId("");
      setEditCode("");
      setEditTitle("");
      setEditType(NODE_TYPES[0]?.label ?? "");
      setEditShortDescription("");
      setEditDescription("");
      setEditIcon("");
      setEditAvatar("");
      setEditX(0);
      setEditY(0);
      return;
    }

    const id = Number(value);
    const node = nodes.find((item) => item.id === id);
    setEditNodeId(id);

    if (!node) {
      return;
    }

    setEditCode(node.code);
    setEditTitle(node.title);
    const typeByLabel =
      NODE_TYPES.find((item) => item.value === node.type_en) ??
      NODE_TYPES.find((item) => item.label === node.type) ??
      NODE_TYPES[0];
    setEditType(typeByLabel?.label ?? NODE_TYPES[0]?.label ?? "");
    setEditShortDescription(node.short_description ?? "");
    setEditDescription(node.description ?? "");
    setEditIcon(node.icon ?? "");
    setEditAvatar(node.avatar ?? "");
    setEditX(node.position?.x ?? 0);
    setEditY(node.position?.y ?? 0);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          (data && (data.message as string)) ||
            "Ошибка авторизации. Проверьте логин и пароль.",
        );
        return;
      }

      const data = await response.json();

      if (typeof data.token !== "string") {
        setError("Ответ авторизации некорректен.");
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("adminToken", data.token);
      }

      setToken(data.token);
    } catch (e) {
      setError("Не удалось выполнить авторизацию.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch {
      // игнорируем ошибку выхода
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("adminToken");
      }
      setToken(null);
      setNodes([]);
      setEdges([]);
      setLoading(false);
    }
  };

  const handleCreateNode = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError("Необходима авторизация.");
      return;
    }

    if (!newCode || !newTitle || !newShortDescription || !newDescription) {
      setError("Заполните все обязательные поля ноды.");
      return;
    }

    const nodeType = NODE_TYPES.find((item) => item.label === newType);
    if (!nodeType) {
      setError("Некорректный тип ноды.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const nodeResponse = await fetch(`${API_URL}/admin/nodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: newCode,
          title: newTitle,
          type: nodeType.label,
          type_en: nodeType.value,
          short_description: newShortDescription,
          description: newDescription,
          icon: newIcon || null,
          avatar: newAvatar || null,
          meta: {},
          position: {
            x: newX ?? 0,
            y: newY ?? 0,
          },
        }),
      });

      if (!nodeResponse.ok) {
        const data = await nodeResponse.json().catch(() => null);
        setError(
          (data && (data.message as string)) ||
            "Не удалось создать ноду. Проверьте данные.",
        );
        return;
      }

      const createdNode: INode = await nodeResponse.json();

      if (relationTargetId && relationType) {
        const edgeType = EDGE_TYPES.find(
          (item) => item.label === relationType,
        );

        if (!edgeType) {
          setError("Некорректный тип связи.");
          return;
        }

        const fromId =
          relationDirection === "from_new"
            ? createdNode.id
            : Number(relationTargetId);
        const toId =
          relationDirection === "from_new"
            ? Number(relationTargetId)
            : createdNode.id;

        const edgeResponse = await fetch(`${API_URL}/admin/edges`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            from_node_id: fromId,
            to_node_id: toId,
            type: edgeType.label,
            type_en: edgeType.value,
            meta: {},
          }),
        });

        if (!edgeResponse.ok) {
          const data = await edgeResponse.json().catch(() => null);
          setError(
            (data && (data.message as string)) ||
              "Нода создана, но связь добавить не удалось.",
          );
        }
      }

      setNewCode("");
      setNewTitle("");
      setNewShortDescription("");
      setNewDescription("");
      setNewIcon("");
      setNewAvatar("");
      setNewX(0);
      setNewY(0);
      setRelationTargetId("");
      setRelationType(EDGE_TYPES[0]?.label ?? "");
      setRelationDirection("from_new");

      await fetchGraph();
    } catch {
      setError("Ошибка при создании ноды.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNode = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError("Необходима авторизация.");
      return;
    }

    if (!editNodeId) {
      setError("Выберите ноду для редактирования.");
      return;
    }

    if (!editCode || !editTitle || !editShortDescription || !editDescription) {
      setError("Заполните все обязательные поля ноды.");
      return;
    }

    const nodeType = NODE_TYPES.find((item) => item.label === editType);
    if (!nodeType) {
      setError("Некорректный тип ноды.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/nodes/${editNodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: editCode,
          title: editTitle,
          type: nodeType.label,
          type_en: nodeType.value,
          short_description: editShortDescription,
          description: editDescription,
          icon: editIcon || null,
          avatar: editAvatar || null,
          meta: {},
          position: {
            x: editX ?? 0,
            y: editY ?? 0,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          (data && (data.message as string)) ||
            "Не удалось обновить ноду. Проверьте данные.",
        );
        return;
      }

      await fetchGraph();
    } catch {
      setError("Ошибка при обновлении ноды.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNode = async () => {
    if (!token) {
      setError("Необходима авторизация.");
      return;
    }

    if (!deleteNodeId) {
      setError("Выберите ноду для удаления.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/admin/nodes/${deleteNodeId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          (data && (data.message as string)) ||
            "Не удалось удалить ноду. Возможно, есть связанные связи.",
        );
        return;
      }

      setDeleteNodeId("");
      await fetchGraph();
    } catch {
      setError("Ошибка при удалении ноды.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Админка графа
          </h1>
          <p className="text-sm text-zinc-500">
            Войдите с помощью Laravel-аккаунта, чтобы управлять нодами и
            связями.
          </p>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700">
                Пароль
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Админка графа
            </h1>
            <p className="text-sm text-zinc-500">
              Добавление новых нод и связей, удаление существующих нод.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Выйти
          </button>
        </header>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Добавление ноды и связи
            </h2>
            <button
              type="button"
              onClick={fetchGraph}
              className="text-xs text-zinc-500 hover:text-zinc-800"
            >
              Обновить список нод
            </button>
          </div>

          <form
            onSubmit={handleCreateNode}
            className="flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap"
          >
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-end w-full">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Код
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newCode}
                  onChange={(event) => setNewCode(event.target.value)}
                  placeholder="zeus_child"
                  required
                />
              </div>

              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Заголовок
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Новая нода"
                  required
                />
              </div>

              <div className="w-[140px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Тип ноды
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newType}
                  onChange={(event) => setNewType(event.target.value)}
                >
                  {NODE_TYPES.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[120px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  X
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newX}
                  onChange={(event) =>
                    setNewX(Number(event.target.value) || 0)
                  }
                />
              </div>

              <div className="w-[120px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Y
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newY}
                  onChange={(event) =>
                    setNewY(Number(event.target.value) || 0)
                  }
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Краткое описание
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newShortDescription}
                  onChange={(event) =>
                    setNewShortDescription(event.target.value)
                  }
                  placeholder="Кратко о ноде"
                  required
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  placeholder="Полное описание"
                  required
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Icons (имя файла в /icons)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newIcon}
                  onChange={(event) => setNewIcon(event.target.value)}
                  placeholder="zeus.svg"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Avatar (имя файла в /avatars)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={newAvatar}
                  onChange={(event) => setNewAvatar(event.target.value)}
                  placeholder="zeus.png"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-end w-full border-t border-dashed border-zinc-200 pt-3 mt-2">
              <div className="w-[220px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Связать с нодой
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={relationTargetId}
                  onChange={(event) =>
                    setRelationTargetId(
                      event.target.value
                        ? Number(event.target.value)
                        : "",
                    )
                  }
                >
                  <option value="">Без связи</option>
                  {sortedNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title} ({node.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[160px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Тип связи
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={relationType}
                  onChange={(event) => setRelationType(event.target.value)}
                >
                  {EDGE_TYPES.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[220px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Направление связи
                </label>
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-3 w-3"
                      checked={relationDirection === "from_new"}
                      onChange={() => setRelationDirection("from_new")}
                    />
                    <span>новая → выбранная</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      className="h-3 w-3"
                      checked={relationDirection === "to_new"}
                      onChange={() => setRelationDirection("to_new")}
                    />
                    <span>выбранная → новая</span>
                  </label>
                </div>
              </div>

              <div className="md:ml-auto">
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-md bg-zinc-900 text-white px-4 py-2 text-xs font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Сохраняем..." : "Добавить ноду"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Редактирование ноды
            </h2>
          </div>

          <form
            onSubmit={handleUpdateNode}
            className="flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap"
          >
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-end w-full">
              <div className="flex-1 min-w-[220px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Нода
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editNodeId}
                  onChange={(event) => handleSelectEditNode(event.target.value)}
                >
                  <option value="">Не выбрана</option>
                  {sortedNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title} ({node.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Код
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editCode}
                  onChange={(event) => setEditCode(event.target.value)}
                  placeholder="zeus_child"
                  required
                />
              </div>

              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Заголовок
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  placeholder="Новая нода"
                  required
                />
              </div>

              <div className="w-[140px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Тип ноды
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editType}
                  onChange={(event) => setEditType(event.target.value)}
                >
                  {NODE_TYPES.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[120px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  X
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editX}
                  onChange={(event) =>
                    setEditX(Number(event.target.value) || 0)
                  }
                />
              </div>

              <div className="w-[120px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Y
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editY}
                  onChange={(event) =>
                    setEditY(Number(event.target.value) || 0)
                  }
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Краткое описание
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editShortDescription}
                  onChange={(event) =>
                    setEditShortDescription(event.target.value)
                  }
                  placeholder="Кратко о ноде"
                  required
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  placeholder="Полное описание"
                  required
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Icons (имя файла в /icons)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editIcon}
                  onChange={(event) => setEditIcon(event.target.value)}
                  placeholder="zeus.svg"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Avatar (имя файла в /avatars)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  value={editAvatar}
                  onChange={(event) => setEditAvatar(event.target.value)}
                  placeholder="zeus.png"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              {editIcon ? (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span>Иконка:</span>
                  <img
                    src={`/icons/${editIcon}`}
                    alt=""
                    className="h-6 w-6 border border-zinc-200 rounded-full bg-white"
                  />
                </div>
              ) : null}

              <div className="md:ml-auto">
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-md bg-zinc-900 text-white px-4 py-2 text-xs font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Сохраняем..." : "Сохранить изменения"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Удаление ноды
            </h2>
            <p className="text-xs text-zinc-500">
              Важно: связей автоматически не удаляем.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Нода для удаления
              </label>
              <select
                className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={deleteNodeId}
                onChange={(event) =>
                  setDeleteNodeId(
                    event.target.value ? Number(event.target.value) : "",
                  )
                }
              >
                <option value="">Не выбрана</option>
                {sortedNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.title} ({node.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleDeleteNode}
              className="w-full md:w-auto rounded-md bg-red-600 text-white px-4 py-2 text-xs font-medium hover:bg-red-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Удаляем..." : "Удалить ноду"}
            </button>
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Текущее состояние графа
            </h2>
            {loading && (
              <span className="text-xs text-zinc-500">Обновление...</span>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            Нод: {nodes.length}, связей: {edges.length}
          </p>
        </section>
      </div>
    </main>
  );
}

