import { loadTemplate } from "@/utils/loadData";

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return loadTemplate(query.id, "pilot");
})

