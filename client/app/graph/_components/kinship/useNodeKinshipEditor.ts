import { useMemo, useState } from "react";
import type { IGraphNode } from "@/app/graph/types";
import { api, ApiError } from "@/app/lib/api";
import { useToast } from "@/app/context/ToastContext";

interface MetaOption {
    label: string;
    value: string;
}

interface UseNodeKinshipEditorParams {
    selectedNode: IGraphNode;
    allNodes: IGraphNode[];
    token: string | null;
    nodeTypes: MetaOption[];
    genders: MetaOption[];
    refreshGraph: () => Promise<void>;
}

export function useNodeKinshipEditor({
    selectedNode,
    allNodes,
    token,
    nodeTypes,
    genders,
    refreshGraph,
}: UseNodeKinshipEditorParams) {
    const [relationError, setRelationError] = useState<string | null>(null);
    const [relationLoading, setRelationLoading] = useState(false);
    const { showError } = useToast();

    const [showSiblingForm, setShowSiblingForm] = useState(false);
    const [showChildForm, setShowChildForm] = useState(false);

    const [siblingMode, setSiblingMode] = useState<"existing" | "new">("existing");
    const [siblingTargetId, setSiblingTargetId] = useState<number | "">("");
    const [siblingNewCode, setSiblingNewCode] = useState("");
    const [siblingNewTitle, setSiblingNewTitle] = useState("");
    const [siblingNewTypeLabel, setSiblingNewTypeLabel] = useState<string>("");
    const [siblingNewGender, setSiblingNewGender] = useState<string>("");
    const [siblingNewShortDescription, setSiblingNewShortDescription] = useState("");
    const [siblingNewDescription, setSiblingNewDescription] = useState("");
    const [siblingNewIcon, setSiblingNewIcon] = useState("");
    const [siblingNewAvatar, setSiblingNewAvatar] = useState("");

    const [childMode, setChildMode] = useState<"existing" | "new">("existing");
    const [childTargetId, setChildTargetId] = useState<number | "">("");
    const [childNewCode, setChildNewCode] = useState("");
    const [childNewTitle, setChildNewTitle] = useState("");
    const [childNewTypeLabel, setChildNewTypeLabel] = useState<string>("");
    const [childNewGender, setChildNewGender] = useState<string>("");
    const [childNewShortDescription, setChildNewShortDescription] = useState("");
    const [childNewDescription, setChildNewDescription] = useState("");
    const [childNewIcon, setChildNewIcon] = useState("");
    const [childNewAvatar, setChildNewAvatar] = useState("");

    const selectableNodes = useMemo(
        () =>
            allNodes
                .filter((node) => node.id !== selectedNode.id)
                .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "")),
        [allNodes, selectedNode.id],
    );

    const resetSiblingNewState = () => {
        setSiblingNewCode("");
        setSiblingNewTitle("");
        setSiblingNewTypeLabel(nodeTypes[0]?.label ?? "");
        setSiblingNewGender("");
        setSiblingNewShortDescription("");
        setSiblingNewDescription("");
        setSiblingNewIcon("");
        setSiblingNewAvatar("");
    };

    const resetChildNewState = () => {
        setChildNewCode("");
        setChildNewTitle("");
        setChildNewTypeLabel(nodeTypes[0]?.label ?? "");
        setChildNewGender("");
        setChildNewShortDescription("");
        setChildNewDescription("");
        setChildNewIcon("");
        setChildNewAvatar("");
    };

    // Вспомогательный вызов API для создания связи между двумя нодами.
    const createEdge = async (fromId: number, toId: number, typeLabel: string, typeEn: string) => {
        if (!token) {
            throw new Error("Нет токена авторизации.");
        }

        await api.edges.create(token, {
            from_node_id: fromId,
            to_node_id: toId,
            type: typeLabel,
            type_en: typeEn,
            meta: {},
        });
    };

    const handleAddSiblingExisting = async () => {
        if (!token) {
            return;
        }

        if (!siblingTargetId) {
            setRelationError("Выберите ноду для связи.");
            return;
        }

        try {
            setRelationLoading(true);
            setRelationError(null);

            await createEdge(selectedNode.id, Number(siblingTargetId), "брат/сестра", "sibling");

            setSiblingTargetId("");
            await refreshGraph();
        } catch (error: any) {
            const message =
                error instanceof ApiError || error instanceof Error
                    ? error.message
                    : "Ошибка при добавлении связи.";
            setRelationError(message);
            showError(message);
        } finally {
            setRelationLoading(false);
        }
    };

    const handleAddSiblingNew = async () => {
        if (!token) {
            return;
        }

        if (
            !siblingNewCode ||
            !siblingNewTitle ||
            !siblingNewShortDescription ||
            !siblingNewDescription
        ) {
            setRelationError("Заполните все поля новой ноды.");
            return;
        }

        const nodeType =
            nodeTypes.find((item) => item.label === siblingNewTypeLabel) ?? nodeTypes[0];

        if (!nodeType) {
            setRelationError("Некорректный тип ноды.");
            return;
        }

        try {
            setRelationLoading(true);
            setRelationError(null);

            const createdNode = (await api.nodes.create(token, {
                code: siblingNewCode,
                title: siblingNewTitle,
                type: nodeType.label,
                type_en: nodeType.value,
                gender: siblingNewGender || null,
                short_description: siblingNewShortDescription,
                description: siblingNewDescription,
                icon: siblingNewIcon || null,
                avatar: siblingNewAvatar || null,
                meta: {},
                position: selectedNode.position ?? null,
            })) as { id: number };

            await createEdge(selectedNode.id, createdNode.id, "брат/сестра", "sibling");

            resetSiblingNewState();
            await refreshGraph();
        } catch (error: any) {
            const message =
                error instanceof ApiError || error instanceof Error
                    ? error.message
                    : "Ошибка при создании ноды или связи.";
            setRelationError(message);
            showError(message);
        } finally {
            setRelationLoading(false);
        }
    };

    const handleAddChildExisting = async () => {
        if (!token) {
            return;
        }

        if (!childTargetId) {
            setRelationError("Выберите ноду-ребёнка.");
            return;
        }

        try {
            setRelationLoading(true);
            setRelationError(null);

            await createEdge(selectedNode.id, Number(childTargetId), "родитель", "parent");

            setChildTargetId("");
            await refreshGraph();
        } catch (error: any) {
            const message =
                error instanceof ApiError || error instanceof Error
                    ? error.message
                    : "Ошибка при добавлении связи.";
            setRelationError(message);
            showError(message);
        } finally {
            setRelationLoading(false);
        }
    };

    const handleAddChildNew = async () => {
        if (!token) {
            return;
        }

        if (!childNewCode || !childNewTitle || !childNewShortDescription || !childNewDescription) {
            setRelationError("Заполните все поля новой ноды-ребёнка.");
            return;
        }

        const nodeType = nodeTypes.find((item) => item.label === childNewTypeLabel) ?? nodeTypes[0];

        if (!nodeType) {
            setRelationError("Некорректный тип ноды.");
            return;
        }

        try {
            setRelationLoading(true);
            setRelationError(null);

            const createdNode = (await api.nodes.create(token, {
                code: childNewCode,
                title: childNewTitle,
                type: nodeType.label,
                type_en: nodeType.value,
                gender: childNewGender || null,
                short_description: childNewShortDescription,
                description: childNewDescription,
                icon: childNewIcon || null,
                avatar: childNewAvatar || null,
                meta: {},
                position: selectedNode.position ?? null,
            })) as { id: number };

            await createEdge(selectedNode.id, createdNode.id, "родитель", "parent");

            resetChildNewState();
            await refreshGraph();
        } catch (error: any) {
            const message =
                error instanceof ApiError || error instanceof Error
                    ? error.message
                    : "Ошибка при создании ноды-ребёнка или связи.";
            setRelationError(message);
            showError(message);
        } finally {
            setRelationLoading(false);
        }
    };

    const toggleSiblingForm = () => {
        setShowSiblingForm((prev) => !prev);
        setShowChildForm(false);
        setRelationError(null);
    };

    const toggleChildForm = () => {
        setShowChildForm((prev) => !prev);
        setShowSiblingForm(false);
        setRelationError(null);
    };

    return {
        relationError,
        relationLoading,
        selectableNodes,

        showSiblingForm,
        showChildForm,
        toggleSiblingForm,
        toggleChildForm,

        siblingMode,
        setSiblingMode,
        siblingTargetId,
        setSiblingTargetId,
        siblingNewCode,
        setSiblingNewCode,
        siblingNewTitle,
        setSiblingNewTitle,
        siblingNewTypeLabel,
        setSiblingNewTypeLabel,
        siblingNewGender,
        setSiblingNewGender,
        siblingNewShortDescription,
        setSiblingNewShortDescription,
        siblingNewDescription,
        setSiblingNewDescription,
        siblingNewIcon,
        setSiblingNewIcon,
        siblingNewAvatar,
        setSiblingNewAvatar,

        childMode,
        setChildMode,
        childTargetId,
        setChildTargetId,
        childNewCode,
        setChildNewCode,
        childNewTitle,
        setChildNewTitle,
        childNewTypeLabel,
        setChildNewTypeLabel,
        childNewGender,
        setChildNewGender,
        childNewShortDescription,
        setChildNewShortDescription,
        childNewDescription,
        setChildNewDescription,
        childNewIcon,
        setChildNewIcon,
        childNewAvatar,
        setChildNewAvatar,

        handleAddSiblingExisting,
        handleAddSiblingNew,
        handleAddChildExisting,
        handleAddChildNew,

        nodeTypes,
        genders,
    };
}
