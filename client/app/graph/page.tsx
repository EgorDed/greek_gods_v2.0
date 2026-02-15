import GraphArea from "@/app/graph/_components/GraphArea";
import {GraphContextWrapper} from "@/app/graph/_components/GraphContextWrappper";
import Header from "@/app/graph/_components/Header";

export interface INode {
    id: number,
    code: string,
    title: string,
    type: string,
    type_en: string,
    meta: object,
    short_description: string,
    description: string,
    updated_at: string,
    created_at: string
}

export interface IEdge {
    id: number,
    from_node_id: number,
    to_node_id: number,
    type: string,
    type_en: string,
    meta: object,
    updated_at: string,
    created_at: string
}

export interface IGraph {
    nodes: INode[],
    edges: IEdge[]
}

export default async function Page() {
    const url:string = process.env.API_URL ? process.env.API_URL : 'http://127.0.0.1:8000/api'
    const graphData:IGraph = await fetch(`${url}/graph`).then(res => res.json())
    return (
       <GraphContextWrapper graphData={graphData}>
           <Header />
           <GraphArea />
       </GraphContextWrapper>
    )
}