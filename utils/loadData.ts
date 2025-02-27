import { promises as fsPromises } from "fs";
import path from "path";

import yaml from "yaml";
import Ajv, { type ValidateFunction } from "ajv";

import labSchema from "./schemas/lab.json";
import projectSchema from "./schemas/project.json";
import labsSchema from "./schemas/labs.json";
import projectsSchema from "./schemas/projects.json";
import type { Project, Projects } from "~/types/projects";
import type { Lab, Labs } from "~/types/labs";

const DATA_DIR = "./data";
const PROJECTS_FILE = "projects.yaml";
const LABS_FILE = "labs.yaml";
const CONFIG_FILE = "config.yaml";
const PRODUCTS_DIR = "products";

const ajv = new Ajv({ allowUnionTypes: true });
ajv.addSchema(labSchema, "utils/schemas/lab.json");
ajv.addSchema(projectSchema, "utils/schemas/project.json");
const LABS_SCHEMA: ValidateFunction = ajv.compile(labsSchema);
const PROJECTS_SCHEMA: ValidateFunction = ajv.compile(projectsSchema);

export interface ExtendedProject extends Project {
  id: string;
  lab: Lab;
  descriptionDisplay: string;
}

function validateData(basename: string, content: object) {
  let schema: ValidateFunction;
  switch (basename) {
    case LABS_FILE:
      schema = LABS_SCHEMA;
      break;
    case PROJECTS_FILE:
      schema = PROJECTS_SCHEMA;
      break;
    default:
      throw new Error(`unsupported file '${basename}'`);
  }
  if (!schema(content)) {
    throw new Error(`invalid YAML: ${JSON.stringify(schema.errors)}`);
  }
}

export async function loadConfiguration(): Promise<object> {
  const filePath = path.join(DATA_DIR, CONFIG_FILE);
  return yaml.parse(await fsPromises.readFile(filePath, "utf-8"));
}

export async function loadLabs(skipValidation: boolean = false): Promise<Labs> {
  const filePath = path.join(DATA_DIR, LABS_FILE);
  const content: Labs = yaml.parse(await fsPromises.readFile(filePath, "utf-8"));
  if (!skipValidation) {
    validateData(LABS_FILE, content);
  }
  return content;
}

async function loadLabProjects(
  labProjectsDir: { name: string },
  labs: Labs,
  skipValidation: boolean
): Promise<ExtendedProject[]> {
  const projectsFilePath = path.join(DATA_DIR, labProjectsDir.name, PROJECTS_FILE);
  const labProjects: Projects = yaml.parse(await fsPromises.readFile(projectsFilePath, "utf-8"));

  if (!skipValidation) {
    validateData(PROJECTS_FILE, labProjects);
  }
  return Object.entries(labProjects.projects).flatMap((rawProject) => {
    const projectId = rawProject[0];
    const project = rawProject[1];
    const lab: Lab = labs.labs[labProjectsDir.name];
    const descriptionDisplay = project.layman_desc ?? project.tech_desc ?? project.description;
    project.logo = project.logo || lab.logo || "https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg";
    return { ...project, id: projectId, lab, descriptionDisplay };
  });
}

export async function loadProjects(skipValidation: boolean = false): Promise<ExtendedProject[]> {
  const labs = await loadLabs();

  const projectLabsDirectories = (await fsPromises.readdir(DATA_DIR, { withFileTypes: true })).filter(
    (labProjectsDir) => labProjectsDir.isDirectory() && labProjectsDir.name !== PRODUCTS_DIR
  );

  return (
    await Promise.all(
      projectLabsDirectories.map((labProjectsDir) => loadLabProjects(labProjectsDir, labs, skipValidation))
    )
  ).flat();
}

export async function loadTemplate(projectId: string, templateType: string): Promise<string | null> {
  const templateFilePath = (
    await fsPromises.readdir(path.join(DATA_DIR, PRODUCTS_DIR, templateType), { withFileTypes: true })
  ).find((file) => file.name == `${projectId}.tpl`);
  return templateFilePath
    ? await fsPromises.readFile(path.join(DATA_DIR, PRODUCTS_DIR, templateType, templateFilePath.name), "utf-8")
    : null;
}
