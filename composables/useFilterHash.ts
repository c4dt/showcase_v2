import { deserializeHash, serializeHash } from "~/utils/filterHash";

export function useFilterHash() {
  const search = useState<string>("filter-search", () => "");
  const lab = useState<string>("filter-lab", () => "");
  const category = useState<string>("filter-category", () => "");
  const application = useState<string>("filter-application", () => "");
  const status = useState<string>("filter-status", () => "");
  const tags = useState<string[]>("filter-tags", () => []);

  function syncFromHash() {
    const parsed = deserializeHash(window.location.hash);
    search.value = parsed.search;
    lab.value = parsed.lab;
    category.value = parsed.category;
    application.value = parsed.application;
    status.value = parsed.status;
    tags.value = [...parsed.tags];
  }

  // Write hash when any state changes (client-only)
  watch(
    [search, lab, category, application, status, tags],
    () => {
      if (typeof window === "undefined") return;
      const hash = serializeHash({
        search: search.value,
        lab: lab.value,
        category: category.value,
        application: application.value,
        status: status.value,
        tags: tags.value
      });
      history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
    },
    { deep: true }
  );

  onMounted(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
  });

  onUnmounted(() => {
    window.removeEventListener("hashchange", syncFromHash);
  });

  const searchQuery = computed({
    get: () => search.value,
    set: (v: string) => {
      search.value = v;
    }
  });

  function resetFilters() {
    search.value = "";
    lab.value = "";
    category.value = "";
    application.value = "";
    status.value = "";
    tags.value = [];
  }

  return { search, lab, category, application, status, tags, searchQuery, resetFilters };
}
