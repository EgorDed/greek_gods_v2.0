import { api, ApiError } from "@/app/lib/api";

export type MetaOption = {
    label: string;
    value: string;
};

export interface MetaOptions {
    nodeTypes: MetaOption[];
    edgeTypes: MetaOption[];
    genders: MetaOption[];
}

let cachedOptions: MetaOptions | null = null;
let inFlightPromise: Promise<MetaOptions> | null = null;

export async function fetchMetaOptions(): Promise<MetaOptions> {
    if (cachedOptions) {
        return cachedOptions;
    }

    if (inFlightPromise) {
        return inFlightPromise;
    }

    inFlightPromise = (async () => {
        try {
            const data = await api.meta.getOptions();

            cachedOptions = {
                nodeTypes: data.node_types ?? [],
                edgeTypes: data.edge_types ?? [],
                genders: data.genders ?? [],
            };

            return cachedOptions;
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message || "Failed to load meta options");
            }

            throw new Error("Failed to load meta options");
        } finally {
            inFlightPromise = null;
        }
    })();

    return inFlightPromise;
}
