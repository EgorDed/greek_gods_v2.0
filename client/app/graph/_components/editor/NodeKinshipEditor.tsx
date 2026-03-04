import React from "react";
import { Button } from "@/components/ui/button";
import type { IGraphNode } from "@/app/graph/types";
import { SiblingRelationSection } from "@/app/graph/_components/kinship/SiblingRelationSection";
import { ChildRelationSection } from "@/app/graph/_components/kinship/ChildRelationSection";
import { useNodeKinshipEditor } from "@/app/graph/_components/kinship/useNodeKinshipEditor";

interface NodeKinshipEditorProps {
    selectedNode: IGraphNode;
    allNodes: IGraphNode[];
    token: string | null;
    nodeTypes: { label: string; value: string }[];
    genders: { label: string; value: string }[];
    refreshGraph: () => Promise<void>;
}

// Редактор родственных связей для выбранной ноды.
// Здесь только логика и переключение между секциями "брат/сестра" и "сын/дочь".
export const NodeKinshipEditor: React.FC<NodeKinshipEditorProps> = ({
    selectedNode,
    allNodes,
    token,
    nodeTypes,
    genders,
    refreshGraph,
}) => {
    const {
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
    } = useNodeKinshipEditor({
        selectedNode,
        allNodes,
        token,
        nodeTypes,
        genders,
        refreshGraph,
    });

    return (
        <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 hover:bg-white/10 text-[11px] h-8 px-3"
                    onClick={toggleSiblingForm}
                >
                    Добавить брата/сестру
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/5 border-white/20 hover:bg-white/10 text-[11px] h-8 px-3"
                    onClick={toggleChildForm}
                >
                    Добавить сына/дочь
                </Button>
            </div>

            {relationError && (
                <div className="rounded-md border border-red-400/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                    {relationError}
                </div>
            )}

            {showSiblingForm && (
                <SiblingRelationSection
                    mode={siblingMode}
                    setMode={setSiblingMode}
                    selectableNodes={selectableNodes}
                    siblingTargetId={siblingTargetId}
                    setSiblingTargetId={setSiblingTargetId}
                    siblingNewCode={siblingNewCode}
                    setSiblingNewCode={setSiblingNewCode}
                    siblingNewTitle={siblingNewTitle}
                    setSiblingNewTitle={setSiblingNewTitle}
                    siblingNewTypeLabel={siblingNewTypeLabel}
                    setSiblingNewTypeLabel={setSiblingNewTypeLabel}
                    siblingNewGender={siblingNewGender}
                    setSiblingNewGender={setSiblingNewGender}
                    siblingNewShortDescription={siblingNewShortDescription}
                    setSiblingNewShortDescription={setSiblingNewShortDescription}
                    siblingNewDescription={siblingNewDescription}
                    setSiblingNewDescription={setSiblingNewDescription}
                    siblingNewIcon={siblingNewIcon}
                    setSiblingNewIcon={setSiblingNewIcon}
                    siblingNewAvatar={siblingNewAvatar}
                    setSiblingNewAvatar={setSiblingNewAvatar}
                    nodeTypes={nodeTypes}
                    genders={genders}
                    loading={relationLoading}
                    onCreateExisting={handleAddSiblingExisting}
                    onCreateNew={handleAddSiblingNew}
                />
            )}

            {showChildForm && (
                <ChildRelationSection
                    mode={childMode}
                    setMode={setChildMode}
                    selectableNodes={selectableNodes}
                    childTargetId={childTargetId}
                    setChildTargetId={setChildTargetId}
                    childNewCode={childNewCode}
                    setChildNewCode={setChildNewCode}
                    childNewTitle={childNewTitle}
                    setChildNewTitle={setChildNewTitle}
                    childNewTypeLabel={childNewTypeLabel}
                    setChildNewTypeLabel={setChildNewTypeLabel}
                    childNewGender={childNewGender}
                    setChildNewGender={setChildNewGender}
                    childNewShortDescription={childNewShortDescription}
                    setChildNewShortDescription={setChildNewShortDescription}
                    childNewDescription={childNewDescription}
                    setChildNewDescription={setChildNewDescription}
                    childNewIcon={childNewIcon}
                    setChildNewIcon={setChildNewIcon}
                    childNewAvatar={childNewAvatar}
                    setChildNewAvatar={setChildNewAvatar}
                    nodeTypes={nodeTypes}
                    genders={genders}
                    loading={relationLoading}
                    onCreateExisting={handleAddChildExisting}
                    onCreateNew={handleAddChildNew}
                />
            )}
        </div>
    );
};
