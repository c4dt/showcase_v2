import { loadTemplate } from "@/utils/loadData";

function getLabel(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "id");
  if (!projectId) {
    throw createError({
      statusCode: 404,
      statusMessage: `Invalid projectId: "${projectId}"`
    });
  }
  const templateNames = ["presentation", "app", "demo", "details", "hands-on", "pilot"];

  const templates = [];
  for (const name of templateNames) {
    const template = await loadTemplate(projectId, name);
    if (template) {
      templates.push({
        id: name,
        label: getLabel(name),
        content: template
      });
    }
  }
  return templates;
});
