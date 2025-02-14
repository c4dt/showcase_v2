// standard library imports
import fs from "fs";
import path from "path";

// third party imports
import yaml from "yaml";
import Ajv from "ajv";

// local imports
import labsSchema from "./schemas/labs.json";
import projectsSchema from "./schemas/projects.json";

const DATADIR = "./data";
const PROJECTS_FILE = "projects.yaml";
const LABS_FILE = "labs.yaml";
const CONFIG_FILE = "config.yaml";
const PRODUCTSDIR = "products"

function validateData(basename: string, content: string) {
  const ajv = new Ajv({ allowUnionTypes: true });
  let schema;
  switch (basename) {
    case LABS_FILE:
      schema = ajv.compile(labsSchema);
      break;
    case PROJECTS_FILE:
      schema = ajv.compile(projectsSchema);
      break;
    default:
      throw `unsupported file '${basename}'`;
  }
  if (!schema(content)) {
    throw `invalid YAML: ${JSON.stringify(schema.errors)}`;
  }
}

export function loadConfiguration() {
  const filePath = path.join(DATADIR, CONFIG_FILE);
  return yaml.parse(fs.readFileSync(filePath, "utf-8"));
}

export function loadLabs(skipValidation: boolean = false) {
  const filePath = path.join(DATADIR, LABS_FILE);
  const content = yaml.parse(fs.readFileSync(filePath, "utf-8"));
  if (skipValidation) {
    return content;
  }
  validateData(LABS_FILE, content);
  return content;
}

export function loadProjects(skipValidation: boolean = false): object[] {
  const labProjects: object[] = fs
    .readdirSync(DATADIR, { withFileTypes: true })
    .filter((file) => file.isDirectory() && file.name !== PRODUCTSDIR)
    .map((file) => {
      const filePath = path.join(DATADIR, file.name, PROJECTS_FILE);
      const content = yaml.parse(fs.readFileSync(filePath, "utf-8"));
      if (skipValidation) {
        return content;
      }
      validateData(PROJECTS_FILE, content);
      content.lab = file.name;
      return content;
    });
  return labProjects
    .map((labProject) => {
      return Object.entries(labProject.projects).map(([key, project]) => {
        project.id = key;
        project.lab = labProject.lab;
        project.descriptionDisplay = project.layman_desc ?? project.tech_desc ?? project.description;
        project.logo ??= "https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg";
        return project;
      });
    })
    .flat();
}

export function loadTemplate(projectId: string, templateType: string) {
  const templateFilePath = fs.readdirSync(path.join(DATADIR, PRODUCTSDIR, templateType), { withFileTypes: true }).find((file) => file.name == `${projectId}.tpl`);
  return templateFilePath ? fs.readFileSync(path.join(DATADIR, PRODUCTSDIR, templateType, templateFilePath.name), "utf-8")  : null;
}
