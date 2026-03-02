import React, { useEffect, useMemo, useState } from "react";
import { useGraphContext } from "@/app/graph/_components/GraphContextWrappper";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IEdge } from "@/app/graph/page";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://127.0.0.1:8000/api";

const NODE_TYPES: { label: string; value: string }[] = [
  { label: "бог", value: "god" },
  { label: "миф", value: "myth" },
  { label: "артефакт", value: "artifact" },
  { label: "место", value: "place" },
  { label: "событие", value: "event" },
  { label: "герой", value: "hero" },
  { label: "демиург", value: "demiurge" },
];

const NodeCart = () => {
  const {
    graphData,
    selectedNode,
    setSelectedNode,
    isEditMode,
    authToken,
    refreshGraph,
  } = useGraphContext();

  const [title, setTitle] = useState("");
  const [typeLabel, setTypeLabel] = useState<string>(NODE_TYPES[0]?.label ?? "");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNode) {
      return;
    }

    setTitle(selectedNode.title ?? "");
    const currentType =
      NODE_TYPES.find((item) => item.value === selectedNode.type_en) ??
      NODE_TYPES.find((item) => item.label === selectedNode.type) ??
      NODE_TYPES[0];
    setTypeLabel(currentType?.label ?? NODE_TYPES[0]?.label ?? "");
    setShortDescription(selectedNode.short_description ?? "");
    setDescription(selectedNode.description ?? "");
    setAvatar(selectedNode.avatar ?? "");
    setIcon(selectedNode.icon ?? "");
    setError(null);
  }, [selectedNode]);

  const edgesForNode = useMemo(() => {
    if (!selectedNode) {
      return [] as IEdge[];
    }

    return graphData.edges.filter(
      (edge) =>
        edge.from_node_id === selectedNode.id ||
        edge.to_node_id === selectedNode.id,
    );
  }, [graphData.edges, selectedNode]);

  const handleSave = async () => {
    if (!selectedNode || !authToken) {
      return;
    }

    const nodeType =
      NODE_TYPES.find((item) => item.label === typeLabel) ?? NODE_TYPES[0];

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/admin/nodes/${selectedNode.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            code: selectedNode.code,
            title,
            type: nodeType.label,
            type_en: nodeType.value,
            short_description: shortDescription,
            description,
            avatar: avatar || null,
            icon: icon || null,
            meta: selectedNode.meta ?? {},
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          (data && (data.message as string)) ||
            "Не удалось сохранить изменения.",
        );
        return;
      }

      void refreshGraph();
    } catch {
      setError("Ошибка при сохранении изменений.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEdge = async (edgeId: number) => {
    if (!authToken) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/edges/${edgeId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        void refreshGraph();
      }
    } catch {
      // ignore
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full w-full flex items-center justify-center text-white/40 italic p-6 text-center">
        Выберите персонажа на графе, чтобы увидеть подробности
      </div>
    );
  }

  const isEditable = isEditMode && !!authToken;

  return (
    <div className="h-full flex flex-col text-white overflow-y-auto custom-scrollbar bg-black/60 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        <h2 className="text-2xl font-bold tracking-tighter uppercase">
          {selectedNode.title}
        </h2>
        <MoreHorizontal className="size-5 text-white/60 cursor-pointer hover:text-white" />
      </div>

      {/* Image Section */}
      <div className="p-4">
        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/20 bg-gradient-to-br from-purple-900/40 to-black relative shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            {selectedNode.avatar ? (
              <img
                src={`/avatars/${selectedNode.avatar}`}
                alt={selectedNode.title}
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedNode.code}`}
                alt={selectedNode.title}
                className="w-3/4 h-3/4 opacity-80"
              />
            )}
          </div>
        </div>
      </div>

      {/* Info / Edit Section */}
      <div className="px-4 space-y-4 pb-6">
        {!isEditable ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
                  Принадлежность
                </span>
                <span className="text-purple-300 font-medium">
                  {selectedNode.type}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm leading-relaxed text-gray-300 font-light italic">
                {selectedNode.description || selectedNode.short_description}
              </p>
            </div>
          </>
        ) : (
          <>
            {error && (
              <div className="rounded-md border border-red-400/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                  Заголовок
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                  Тип
                </label>
                <select
                  value={typeLabel}
                  onChange={(event) => setTypeLabel(event.target.value)}
                  className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {NODE_TYPES.map((item) => (
                    <option key={item.value} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                  Краткое описание
                </label>
                <input
                  value={shortDescription}
                  onChange={(event) =>
                    setShortDescription(event.target.value)
                  }
                  className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                  Описание
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Icon (/icons)
                  </label>
                  <input
                    value={icon}
                    onChange={(event) => setIcon(event.target.value)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="zeus.svg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Avatar (/avatars)
                  </label>
                  <input
                    value={avatar}
                    onChange={(event) => setAvatar(event.target.value)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="zeus.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-emerald-500/20 border-emerald-400/70 hover:bg-emerald-500/40 text-[11px] h-8 px-3"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Сохраняем..." : "Сохранить"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Связи выбранной ноды */}
        {edgesForNode.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/60 uppercase tracking-widest">
              <span>Связи</span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {edgesForNode.map((edge) => {
                const isFrom = edge.from_node_id === selectedNode.id;
                const otherNodeId = isFrom
                  ? edge.to_node_id
                  : edge.from_node_id;
                const otherNode = graphData.nodes.find(
                  (node) => node.id === otherNodeId,
                );

                return (
                  <div
                    key={edge.id}
                    className="flex items-center justify-between gap-2 text-[11px] text-gray-200 bg-white/5 border border-white/10 rounded-md px-2 py-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {edge.type}{" "}
                        {otherNode ? `→ ${otherNode.title}` : ""}
                      </span>
                    </div>
                    {isEditMode && authToken && (
                      <button
                        type="button"
                        className="text-[10px] text-red-300 hover:text-red-200"
                        onClick={() => handleDeleteEdge(edge.id)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-6">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 text-[10px] px-1 h-9 uppercase tracking-tighter"
          >
            Read More
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 text-[10px] px-1 h-9 uppercase tracking-tighter"
          >
            Related
          </Button>
          <Button
            onClick={() => setSelectedNode(null)}
            variant="outline"
            className="bg-purple-900/40 border-purple-500/50 hover:bg-purple-800/60 text-[10px] px-1 h-9 uppercase tracking-tighter"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeCart;