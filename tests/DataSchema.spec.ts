import { test } from "vitest";
import { loadProjects } from "~/utils/loadData";

test("Verifies that projects data conform to schema", async () => {
  await loadProjects();
});
