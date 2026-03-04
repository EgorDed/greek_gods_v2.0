export interface IGraphNode extends Record<string, unknown> {
    id: number;
    code: string;
    title: string;
    type: string;
    type_en: string;
    gender?: string | null;
    meta: Record<string, unknown> | null;
    short_description: string | null;
    description: string | null;
    icon: string | null;
    avatar: string | null;
    updated_at: string;
    created_at: string;
    position: { x: number; y: number } | null;
}

export interface IGraphEdge {
    id: number;
    from_node_id: number;
    to_node_id: number;
    type: string;
    type_en: string;
    meta: object | null;
    updated_at: string;
    created_at: string;
}

export interface IGraphData {
    nodes: IGraphNode[];
    edges: IGraphEdge[];
}
