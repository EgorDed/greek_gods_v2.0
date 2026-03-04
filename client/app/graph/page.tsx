import GraphArea from "@/app/graph/_components/GraphArea";
import { GraphContextWrapper } from "@/app/graph/_components/GraphContextWrappper";
import Header from "@/app/graph/_components/Header";
import { IGraphNode, IGraphEdge, IGraphData } from "@/app/graph/types";
import { api, ApiError } from "@/app/lib/api";

export type INode = IGraphNode;
export type IEdge = IGraphEdge;
export type IGraph = IGraphData;

export default async function Page() {
    let graphData: IGraph = {
        nodes: [],
        edges: [],
    };

    let initialErrorMessage: string | null = null;

    try {
        graphData = await api.graph.get();
    } catch (error) {
        if (error instanceof ApiError) {
            initialErrorMessage =
                error.message ||
                "Не удалось загрузить граф с сервера. Попробуйте обновить страницу чуть позже.";
        } else {
            initialErrorMessage =
                "Не удалось подключиться к API. Проверьте подключение к сети и попробуйте ещё раз.";
        }
    }

    return (
        <GraphContextWrapper graphData={graphData} initialErrorMessage={initialErrorMessage}>
            <Header />
            <GraphArea />
        </GraphContextWrapper>
    );
}
