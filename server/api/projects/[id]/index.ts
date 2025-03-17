import type { ExtendedProject } from "@/utils/loadData";
import { loadProjects } from "@/utils/loadData";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const projects: ExtendedProject[] = await loadProjects();
  const project = projects.find((project) => project.id == id);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: `Project with id: "${id}" not found`
    });
  }
  return project;
});
