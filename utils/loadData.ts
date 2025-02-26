import { promises as fsPromises } from 'fs';
import path from "path";

import yaml from "yaml";
import Ajv from "ajv";

import labsSchema from "./schemas/labs.json";
import projectsSchema from "./schemas/projects.json";

const DATA_DIR = "./data";
const PROJECTS_FILE = "projects.yaml";
const LABS_FILE = "labs.yaml";
const CONFIG_FILE = "config.yaml";
const PRODUCTS_DIR = "products";

const ajv = new Ajv({ allowUnionTypes: true })
const LABS_SCHEMA = ajv.compile(labsSchema);
const PROJECTS_SCHEMA = ajv.compile(projectsSchema);


function validateData(basename: string, content: string) {
  let schema
  switch (basename) {
    case LABS_FILE:
      schema = LABS_SCHEMA
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

export async function loadConfiguration() {
  const filePath = path.join(DATA_DIR, CONFIG_FILE);
  return yaml.parse(await fsPromises.readFile(filePath, "utf-8"));
}

export async function loadLabs(skipValidation: boolean = false): Promise<object[]> {
  const filePath = path.join(DATA_DIR, LABS_FILE);
  const content = yaml.parse(await fsPromises.readFile(filePath, "utf-8"));
  if (skipValidation) {
    return content;
  }
  validateData(LABS_FILE, content);
  return content.labs;
}

async function loadLabProjects(labProjectsDir: { name: string }, labs: object[], skipValidation: boolean): Promise<object[]> {
  const projectsFilePath = path.join(DATA_DIR, labProjectsDir.name, PROJECTS_FILE)
  const labProjects = yaml.parse(await fsPromises.readFile(projectsFilePath, "utf-8"))

  if (!skipValidation) {
    validateData(PROJECTS_FILE, labProjects);
  }
  const projects = Object.entries(labProjects.projects)
    .flatMap((rawProject) => {
      const project = rawProject[1]
      project.id = rawProject[0];
      project.lab = labProjectsDir.name;
      project.lab = labs[labProjectsDir.name]
      project.descriptionDisplay = project.layman_desc ?? project.tech_desc ?? project.description;
      project.logo ??= project.lab.logo ?? "https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg";
      return project
    })
  return projects;
}

export async function loadProjects(skipValidation: boolean = false): Promise<object[]> {
  const labs = await loadLabs();

  const projectLabsDirectories = (await fsPromises.readdir(DATA_DIR, { withFileTypes: true })
  ).filter((labProjectsDir) => labProjectsDir.isDirectory() && labProjectsDir.name !== PRODUCTS_DIR)

  const projects = (await Promise.all(
    projectLabsDirectories.map((labProjectsDir) =>
      loadLabProjects(labProjectsDir, labs, skipValidation)
    )
  )).flat();
  return projects;
}

export async function loadTemplate(projectId: string, templateType: string) {
  const templateFilePath = (await fsPromises
    .readdir(path.join(DATA_DIR, PRODUCTS_DIR, templateType), { withFileTypes: true })
  ).find((file) => file.name == `${projectId}.tpl`);
  return templateFilePath
    ? await fsPromises.readFile(path.join(DATA_DIR, PRODUCTS_DIR, templateType, templateFilePath.name), "utf-8")
    : null;
}
