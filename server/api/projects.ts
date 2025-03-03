import { loadProjects } from "@/utils/loadData";

export default defineEventHandler(() => {
  return loadProjects();
});
