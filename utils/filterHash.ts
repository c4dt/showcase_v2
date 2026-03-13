export interface FilterState {
  search: string;
  lab: string;
  category: string;
  application: string;
  status: string;
  tags: string[]; // multi-select; serialized as repeated "tags=" params
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: "",
  lab: "",
  category: "",
  application: "",
  status: "",
  tags: []
};

// Fixed key order; skips empty fields; uses URLSearchParams for encoding
export function serializeHash(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.search) params.append("search", state.search);
  if (state.lab) params.append("lab", state.lab);
  if (state.category) params.append("category", state.category);
  if (state.application) params.append("application", state.application);
  if (state.status) params.append("status", state.status);
  for (const tag of state.tags) {
    params.append("tags", tag);
  }
  return params.toString();
}

// Strips leading "#"; falls back to DEFAULT_FILTER_STATE for missing keys
export function deserializeHash(raw: string): FilterState {
  const str = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!str) return { ...DEFAULT_FILTER_STATE, tags: [] };
  const params = new URLSearchParams(str);
  return {
    search: params.get("search") ?? "",
    lab: params.get("lab") ?? "",
    category: params.get("category") ?? "",
    application: params.get("application") ?? "",
    status: params.get("status") ?? "",
    tags: params.getAll("tags")
  };
}
