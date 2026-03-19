/**
 * Validates all YAML data files against their JSON schemas.
 * Run with: bun utils/validate-data.ts
 */
import { promises as fs } from "fs";
import path from "path";

import yaml from "yaml";
import Ajv from "ajv";

import labSchema from "./schemas/lab.json";
import projectSchema from "./schemas/project.json";
import labsSchema from "./schemas/labs.json";
import projectsSchema from "./schemas/projects.json";

const DATA_DIR = "./data";

const ajv = new Ajv({ allowUnionTypes: true });
ajv.addSchema(labSchema, "utils/schemas/lab.json");
ajv.addSchema(projectSchema, "utils/schemas/project.json");
const validateLabs = ajv.compile(labsSchema);
const validateProjects = ajv.compile(projectsSchema);

let errors = 0;

function check(file: string, valid: boolean, errs: unknown) {
  if (valid) {
    console.log(`  ✓  ${file}`);
  } else {
    console.error(`  ✗  ${file}`);
    console.error(`     ${JSON.stringify(errs, null, 2)}`);
    errors++;
  }
}

// Validate labs.yaml
const labsContent = yaml.parse(await fs.readFile(path.join(DATA_DIR, "labs.yaml"), "utf-8"));
check("data/labs.yaml", validateLabs(labsContent), validateLabs.errors);

// Validate each lab's projects.yaml
const dirs = (await fs.readdir(DATA_DIR, { withFileTypes: true })).filter(
  (d) => d.isDirectory() && d.name !== "projectTabs"
);

for (const dir of dirs) {
  const rel = `data/${dir.name}/projects.yaml`;
  const projectsFile = path.join(DATA_DIR, dir.name, "projects.yaml");
  try {
    const content = yaml.parse(await fs.readFile(projectsFile, "utf-8"));
    check(rel, validateProjects(content), validateProjects.errors);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`  ✗  ${rel}: ${(e as Error).message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} file(s) failed validation`);
  process.exit(1);
}
console.log("\nAll data files are valid.");
