"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMetaOptions } from "@/app/hooks/useMetaOptions";
import type { IGraphData, IGraphNode, IGraphEdge } from "@/app/graph/types";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { api, ApiError } from "@/app/lib/api";
import { AdminLoginPanel } from "@/app/admin/_components/AdminLoginPanel";
import { AdminHeader } from "@/app/admin/_components/AdminHeader";
import { AdminCreateNodeSection } from "@/app/admin/_components/AdminCreateNodeSection";
import { AdminEditNodeSection } from "@/app/admin/_components/AdminEditNodeSection";
import { AdminDeleteNodeSection } from "@/app/admin/_components/AdminDeleteNodeSection";
import { AdminGraphStats } from "@/app/admin/_components/AdminGraphStats";

type INode = IGraphNode;
type IEdge = IGraphEdge;

export default function AdminPage() {
    const { options: metaOptions } = useMetaOptions();
    const { token, isAuthenticated, login, logout } = useAuth();
    const { showError, showSuccess } = useToast();

    const NODE_TYPES = metaOptions?.nodeTypes ?? [];
    const EDGE_TYPES = metaOptions?.edgeTypes ?? [];
    const GENDERS = metaOptions?.genders ?? [];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nodes, setNodes] = useState<INode[]>([]);
    const [edges, setEdges] = useState<IEdge[]>([]);

    const [newCode, setNewCode] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<string>("");
    const [newShortDescription, setNewShortDescription] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newIcon, setNewIcon] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [newGender, setNewGender] = useState<string>("");
    const [newX, setNewX] = useState<number>(0);
    const [newY, setNewY] = useState<number>(0);

    const [relationTargetId, setRelationTargetId] = useState<number | "">("");
    const [relationType, setRelationType] = useState<string>("");
    const [relationDirection, setRelationDirection] = useState<"from_new" | "to_new">("from_new");

    const [deleteNodeId, setDeleteNodeId] = useState<number | "">("");

    const [editNodeId, setEditNodeId] = useState<number | "">("");

    const sortedNodes = useMemo(
        () => [...nodes].sort((a, b) => a.title.localeCompare(b.title)),
        [nodes],
    );

    useEffect(() => {
        if (!metaOptions) {
            return;
        }

        if (!newType && NODE_TYPES[0]) {
            setNewType(NODE_TYPES[0].label);
        }

        if (!relationType && EDGE_TYPES[0]) {
            setRelationType(EDGE_TYPES[0].label);
        }
    }, [metaOptions, NODE_TYPES, EDGE_TYPES, newType, relationType]);

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

            const data: IGraphData = await api.graph.get();

            setNodes(data.nodes ?? []);
            setEdges(data.edges ?? []);
        } catch {
            setError("Не удалось загрузить граф.");
            showError("Не удалось загрузить граф.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEditNode = (value: string) => {
        if (!value) {
            setEditNodeId("");
            return;
        }

        const id = Number(value);

        if (Number.isNaN(id)) {
            setEditNodeId("");
            return;
        }

        setEditNodeId(id);
    };

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError(null);

            await login(email, password);
            setError(null);
        } catch (error) {
            const message =
                error instanceof ApiError ? error.message : "Не удалось выполнить авторизацию.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            setError(null);

            await logout();
        } catch {
            // игнорируем ошибку выхода
        } finally {
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

            const createdNode = (await api.nodes.create(token as string, {
                code: newCode,
                title: newTitle,
                type: nodeType.label,
                type_en: nodeType.value,
                gender: newGender || null,
                short_description: newShortDescription,
                description: newDescription,
                icon: newIcon || null,
                avatar: newAvatar || null,
                meta: {},
                position: {
                    x: newX ?? 0,
                    y: newY ?? 0,
                },
            })) as INode;

            if (relationTargetId && relationType) {
                const edgeType = EDGE_TYPES.find((item) => item.label === relationType);

                if (!edgeType) {
                    setError("Некорректный тип связи.");
                    return;
                }

                const fromId =
                    relationDirection === "from_new" ? createdNode.id : Number(relationTargetId);
                const toId =
                    relationDirection === "from_new" ? Number(relationTargetId) : createdNode.id;

                await api.edges.create(token as string, {
                    from_node_id: fromId,
                    to_node_id: toId,
                    type: edgeType.label,
                    type_en: edgeType.value,
                    meta: {},
                });
            }

            setNewCode("");
            setNewTitle("");
            setNewShortDescription("");
            setNewDescription("");
            setNewIcon("");
            setNewAvatar("");
            setNewGender("");
            setNewX(0);
            setNewY(0);
            setRelationTargetId("");
            setRelationType(EDGE_TYPES[0]?.label ?? "");
            setRelationDirection("from_new");

            showSuccess("Нода создана.");
            await fetchGraph();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Ошибка при создании ноды.";
            setError(message);
            showError(message);
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

            await api.nodes.delete(token as string, Number(deleteNodeId));

            setDeleteNodeId("");
            showSuccess("Нода удалена.");
            await fetchGraph();
        } catch (error) {
            const message = error instanceof ApiError ? error.message : "Ошибка при удалении ноды.";
            setError(message);
            showError(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <AdminLoginPanel
                email={email}
                password={password}
                loading={loading}
                error={error}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleLogin}
            />
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <AdminHeader onLogout={handleLogout} />

                {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <AdminCreateNodeSection
                    nodeTypes={NODE_TYPES}
                    edgeTypes={EDGE_TYPES}
                    genders={GENDERS}
                    sortedNodes={sortedNodes}
                    loading={loading}
                    newCode={newCode}
                    newTitle={newTitle}
                    newType={newType}
                    newShortDescription={newShortDescription}
                    newDescription={newDescription}
                    newIcon={newIcon}
                    newAvatar={newAvatar}
                    newGender={newGender}
                    newX={newX}
                    newY={newY}
                    relationTargetId={relationTargetId}
                    relationType={relationType}
                    relationDirection={relationDirection}
                    onChangeNewCode={setNewCode}
                    onChangeNewTitle={setNewTitle}
                    onChangeNewType={setNewType}
                    onChangeNewShortDescription={setNewShortDescription}
                    onChangeNewDescription={setNewDescription}
                    onChangeNewIcon={setNewIcon}
                    onChangeNewAvatar={setNewAvatar}
                    onChangeNewGender={setNewGender}
                    onChangeNewX={setNewX}
                    onChangeNewY={setNewY}
                    onChangeRelationTargetId={setRelationTargetId}
                    onChangeRelationType={setRelationType}
                    onChangeRelationDirection={setRelationDirection}
                    onSubmit={handleCreateNode}
                    onRefreshGraph={fetchGraph}
                />

                <AdminEditNodeSection
                    nodeTypes={NODE_TYPES}
                    sortedNodes={sortedNodes}
                    token={token}
                    loading={loading}
                    editNodeId={editNodeId}
                    onSelectEditNode={handleSelectEditNode}
                    onSaved={fetchGraph}
                />

                <AdminDeleteNodeSection
                    sortedNodes={sortedNodes}
                    loading={loading}
                    deleteNodeId={deleteNodeId}
                    onChangeDeleteNodeId={setDeleteNodeId}
                    onDelete={handleDeleteNode}
                />

                <AdminGraphStats
                    nodesCount={nodes.length}
                    edgesCount={edges.length}
                    loading={loading}
                />
            </div>
        </main>
    );
}
