"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import type { MetaOptions } from "@/app/lib/metaOptions";

export function useMetaOptions() {
    const [options, setOptions] = useState<MetaOptions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            try {
                setLoading(true);
                const data = await api.meta.getOptions();
                if (isMounted) {
                    setOptions({
                        nodeTypes: data.node_types ?? [],
                        edgeTypes: data.edge_types ?? [],
                        genders: data.genders ?? [],
                    });
                    setError(null);
                }
            } catch {
                if (isMounted) {
                    setError("Не удалось загрузить типы сущностей.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return { options, loading, error };
}
