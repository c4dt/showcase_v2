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

function offsetToLineCol(src: string, offset: number): { line: number; col: number } {
  const lines = src.slice(0, offset).split("\n");
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

function showContext(src: string, offset: number, contextLines = 2): string {
  const { line } = offsetToLineCol(src, offset);
  const allLines = src.split("\n");
  const start = Math.max(0, line - 1 - contextLines);
  const end = Math.min(allLines.length, line + contextLines);
  const width = String(end).length;
  return allLines
    .slice(start, end)
    .map((l, i) => {
      const lineNum = start + i + 1;
      const marker = lineNum === line ? ">" : " ";
      return `  ${marker} ${String(lineNum).padStart(width)} | ${l}`;
    })
    .join("\n");
}

function formatErrors(src: string, doc: yaml.Document, errs: Ajv["errors"]): string {
  if (!errs) return "";
  return errs
    .map((err) => {
      const pathParts = err.instancePath
        .split("/")
        .filter(Boolean)
        .map((p) => (/^\d+$/.test(p) ? parseInt(p, 10) : p));

      let locationInfo = "";
      if (pathParts.length > 0) {
        try {
          const node = doc.getIn(pathParts, true) as yaml.Node | null;
          if (node?.range) {
            const { line, col } = offsetToLineCol(src, node.range[0]);
            locationInfo = ` (line ${line}, col ${col})`;
            const context = showContext(src, node.range[0]);
            return `  • ${err.instancePath}${locationInfo}: ${err.message}\n${context}`;
          }
        } catch {
          // fall through to basic format
        }
      }

      return `  • ${err.instancePath || "(root)"}${locationInfo}: ${err.message}`;
    })
    .join("\n\n");
}

function check(file: string, src: string, doc: yaml.Document, valid: boolean, errs: Ajv["errors"]) {
  if (valid) {
    console.log(`  ✓  ${file}`);
  } else {
    console.error(`  ✗  ${file}`);
    console.error(formatErrors(src, doc, errs));
    errors++;
  }
}

// Validate labs.yaml
const labsSrc = await fs.readFile(path.join(DATA_DIR, "labs.yaml"), "utf-8");
const labsDoc = yaml.parseDocument(labsSrc);
const labsContent = labsDoc.toJSON();
check("data/labs.yaml", labsSrc, labsDoc, validateLabs(labsContent), validateLabs.errors);

// Validate each lab's projects.yaml
const dirs = (await fs.readdir(DATA_DIR, { withFileTypes: true })).filter(
  (d) => d.isDirectory() && d.name !== "projectTabs"
);

for (const dir of dirs) {
  const rel = `data/${dir.name}/projects.yaml`;
  const projectsFile = path.join(DATA_DIR, dir.name, "projects.yaml");
  try {
    const src = await fs.readFile(projectsFile, "utf-8");
    const doc = yaml.parseDocument(src);
    const content = doc.toJSON();
    check(rel, src, doc, validateProjects(content), validateProjects.errors);
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
