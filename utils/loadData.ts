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

enum PROJECT_STATUS {
  C4DT_ACTIVE = "C4DT ACTIVE",
  C4DT_WAS_HERE = "C4DT Was Here",
  LAB_ACTIVE = "Lab Active",
  LAB_INACTIVE = "Lab Inactive",
  UNCATEGORIZED = "Uncategorized",
}

export interface ExtendedProject extends Project {
  id: string;
  lab: Lab;
  descriptionDisplay: string;
  status: PROJECT_STATUS;  // == c4dt_status || lab_status
  c4dt_status?: PROJECT_STATUS;
  lab_status?: PROJECT_STATUS;
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
    let c4dt_status: PROJECT_STATUS | undefined = undefined;
    let lab_status: PROJECT_STATUS | undefined = undefined;
    if (project.incubator?.type === "incubated" || project.incubator?.type === "incubated_market") {
      c4dt_status = PROJECT_STATUS.C4DT_ACTIVE;
    } else if (project.incubator?.type === "retired" || project.incubator?.type === "retired_archived") {
      c4dt_status = PROJECT_STATUS.C4DT_WAS_HERE;
    }
    if (project.code?.date_last_commit) {
      // ToDo: refactor and merge with isActive function in utils/misc.ts
      const last_updated = new Date(project.date_updated || project.date_added);  // replace with date.last_updated
      const six_months_duration = 9 * 30 * 24 * 60 * 60 * 1000;
      const six_months_ago = new Date(last_updated.getTime() - six_months_duration);

      if (new Date(project.code.date_last_commit) > six_months_ago) {
        lab_status = PROJECT_STATUS.LAB_ACTIVE;
      }
      else {
        lab_status = PROJECT_STATUS.LAB_INACTIVE;
      }
    }
    const status = c4dt_status || lab_status || PROJECT_STATUS.UNCATEGORIZED;
    return { ...project, id: projectId, lab, descriptionDisplay, status, c4dt_status, lab_status };
  });
}

export async function loadProjects(skipValidation: boolean = false): Promise<ExtendedProject[]> {
  /*
    * Load all projects from all labs, and flattens the array of projects.
    * Also sorts the projects by their status. The order is:
    * 1. C4DT Active
    * 2. C4DT Was Here
    * 3. Lab Active
    * 4. Lab Inactive
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
  const statusOrderArray = [
    PROJECT_STATUS.C4DT_ACTIVE,
    PROJECT_STATUS.C4DT_WAS_HERE,
    PROJECT_STATUS.LAB_ACTIVE,
    PROJECT_STATUS.LAB_INACTIVE,
    PROJECT_STATUS.UNCATEGORIZED,
  ];

  return projects.sort((a, b) => {
    return statusOrderArray.indexOf(a.status) - statusOrderArray.indexOf(b.status);
  });

}

export async function loadTemplate(projectId: string, templateType: string): Promise<string | null> {
  const templateFilePath = (
    await fsPromises.readdir(path.join(DATA_DIR, PRODUCTS_DIR, templateType), { withFileTypes: true })
  ).find((file) => file.name == `${projectId}.tpl`);
  return templateFilePath
    ? await fsPromises.readFile(path.join(DATA_DIR, PRODUCTS_DIR, templateType, templateFilePath.name), "utf-8")
    : null;
}
