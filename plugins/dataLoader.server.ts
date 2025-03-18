export default defineNuxtPlugin(async () => {
  const configuration = await loadConfiguration();
  const projects = await loadProjects();

  useState<Configuration>("configuration", () => configuration);
  useState<ExtendedProject[]>("projects", () => projects);

  for (const project of projects) {
    useState<ExtendedProject>(`project-${project.id}`, () => project);
    const projectTabs = await loadProjectTabs(project.id);
    useState<ProjectTab[]>(`project-${project.id}-tabs`, () => projectTabs);
  }
});
