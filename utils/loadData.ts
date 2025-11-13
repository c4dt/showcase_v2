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
import { PROJECT_C4DT_STATUS, PROJECT_LAB_STATUS } from "./vars";

const DATA_DIR = process.env.PLAYWRIGHT_TEST ? "./e2e/data" : "./data";
const PROJECTS_FILE = "projects.yaml";
const LABS_FILE = "labs.yaml";
const CONFIG_FILE = "config.yaml";
const PRODUCTS_DIR = "customHTMLContent";

const ajv = new Ajv({ allowUnionTypes: true });
ajv.addSchema(labSchema, "utils/schemas/lab.json");
ajv.addSchema(projectSchema, "utils/schemas/project.json");
const LABS_SCHEMA: ValidateFunction = ajv.compile(labsSchema);
const PROJECTS_SCHEMA: ValidateFunction = ajv.compile(projectsSchema);

export interface ProjectTab {
  id: string;
  label: string;
  content: string;
}

export interface ExtendedProject extends Project {
  id: string;
  lab: Lab;
  descriptionDisplay: string;
  status: number;
  c4dt_status?: PROJECT_C4DT_STATUS;
  lab_status?: PROJECT_LAB_STATUS;
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

export interface Configuration {
  highlightedProjects: string[];
}

export async function loadConfiguration(): Promise<Configuration> {
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

export async function loadTemplate(projectId: string, templateType: string): Promise<string | null> {
  const templateFilePath = (
    await fsPromises.readdir(path.join(DATA_DIR, PRODUCTS_DIR, templateType), { withFileTypes: true })
  ).find((file) => file.name == `${projectId}.vue`);
  if (!templateFilePath) {
    return null;
  }
  const template = await fsPromises.readFile(path.join(templateFilePath.parentPath, templateFilePath.name), "utf-8");
  // Remove <template> tags from the template temporarily
  // until the Tabs.vue component is adjusted later
  return template.replace(/<template>/, "").replace(/<\/template>/, "");
}

export async function loadProjectTabs(projectId: string): Promise<ProjectTab[]> {
  const templateNames = ["presentation", "app", "demo", "details", "hands-on", "pilot"];

  const templates = [];
  for (const templateName of templateNames) {
    const template = await loadTemplate(projectId, templateName);
    if (template) {
      templates.push({
        id: templateName,
        label: getLabel(templateName),
        content: template
      });
    }
  }
  return templates;
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
    let c4dt_status: PROJECT_C4DT_STATUS | undefined = undefined;
    let lab_status: PROJECT_LAB_STATUS | undefined = undefined;
    // better sort order
    // active C4DT project gets 8 points
    // active lab project gets 4 points
    // inactive C4DT project gets 2 points
    // inactive lab project gets 1 point
    // active C4DT + active lab > active C4DT + inactive lab > inactive C4DT + active lab > inactive C4DT + inactive lab
    let sortKey = 0;
    let status: number;
    if (project.incubator?.type === "incubated" || project.incubator?.type === "incubated_market") {
      c4dt_status = PROJECT_C4DT_STATUS.ACTIVE;
      sortKey += 8;
      status = 0;
    }
    if (project.incubator?.type === "retired" || project.incubator?.type === "retired_archived") {
      c4dt_status = PROJECT_C4DT_STATUS.RETIRED;
      status = 1;
      sortKey += 2;
    }
    if (project.code?.date_last_commit) {
      // ToDo: refactor and merge with isActive function in utils/misc.ts
      const last_updated = new Date(project.date_updated || project.date_added); // replace with date.last_updated
      const six_months_duration = 9 * 30 * 24 * 60 * 60 * 1000;
      const six_months_ago = new Date(last_updated.getTime() - six_months_duration);

      if (new Date(project.code.date_last_commit) > six_months_ago) {
        lab_status = PROJECT_LAB_STATUS.ACTIVE;
        status = status ?? 2;
        sortKey += 4;
      } else {
        sortKey += 1;
      }
    }
    status = status ?? 3; // highest value instead of undefined for indexOf
    return { ...project, id: projectId, lab, descriptionDisplay, status, c4dt_status, lab_status, sortKey };
  });
}

export async function loadProjects(skipValidation: boolean = false): Promise<ExtendedProject[]> {
  /*
   * Load all projects from all labs, and flattens the array of projects.
   * Also sorts the projects by their status.
   * The order is:
   * 1. C4DT Active + Lab Active
   * 2. C4DT Active + Lab Inactive
   * 3. Lab Active + C4DT Inactive
   * 4. Lab Inactive + C4DT Inactive
   */
  const labs = await loadLabs();

  const projectLabsDirectories = (await fsPromises.readdir(DATA_DIR, { withFileTypes: true })).filter(
    (labProjectsDir) => labProjectsDir.isDirectory() && labProjectsDir.name !== PRODUCTS_DIR
  );

  const projects = (
    await Promise.all(
      projectLabsDirectories.map((labProjectsDir) => loadLabProjects(labProjectsDir, labs, skipValidation))
    )
  ).flat();

  return projects.sort((a, b) => {
    return b.sortKey - a.sortKey;
  });
}
