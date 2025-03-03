import { loadLabs } from "@/utils/loadData";

export default defineEventHandler(() => {
  return loadLabs();
});
