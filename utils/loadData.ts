// standard library imports
import fs from "fs";
import path from "path";

// third party imports
import yaml from "yaml";
import Ajv from "ajv";

// local imports
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

export function loadConfiguration() {
  const filePath = path.join(DATA_DIR, CONFIG_FILE);
  return yaml.parse(fs.readFileSync(filePath, "utf-8"));
}

export function loadLabs(skipValidation: boolean = false) {
  const filePath = path.join(DATA_DIR, LABS_FILE);
  const content = yaml.parse(fs.readFileSync(filePath, "utf-8"));
  if (skipValidation) {
    return content;
  }
  validateData(LABS_FILE, content);
  return content.labs;
}

export function loadProjects(skipValidation: boolean = false): object[] {
  const labProjects: object[] = fs
    .readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((file) => file.isDirectory() && file.name !== PRODUCTS_DIR)
    .map((file) => {
      const filePath = path.join(DATA_DIR, file.name, PROJECTS_FILE);
      const content = yaml.parse(fs.readFileSync(filePath, "utf-8"));
      if (skipValidation) {
        return content;
      }
      validateData(PROJECTS_FILE, content);
      const labs = loadLabs();
      content.lab = labs[file.name];
      return content;
    });
  return labProjects
    .map((labProject) => {
      return Object.entries(labProject.projects).map(([key, project]) => {
        project.id = key;
        project.lab = labProject.lab;
        project.descriptionDisplay = project.layman_desc ?? project.tech_desc ?? project.description;
        project.logo ??= project.lab.logo ?? "https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg";
        return project;
      });
    })
    .flat();
}

export function loadTemplate(projectId: string, templateType: string) {
  const templateFilePath = fs
    .readdirSync(path.join(DATA_DIR, PRODUCTS_DIR, templateType), { withFileTypes: true })
    .find((file) => file.name == `${projectId}.tpl`);
  return templateFilePath
    ? fs.readFileSync(path.join(DATA_DIR, PRODUCTS_DIR, templateType, templateFilePath.name), "utf-8")
    : null;
}
