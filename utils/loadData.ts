// standard library imports
import fs from 'fs';
import path from 'path';

// third party imports
import YAML from 'yaml';
import Ajv from 'ajv';

// local imports
import labsSchema from './schemas/labs.json'
import projectsSchema from './schemas/projects.json'

const DATADIR = './data';
const PROJECTS_FILE = 'projects.yaml';
const LABS_FILE = 'labs.yaml'

function validateData(basename, content) {
  const ajv = new Ajv({ allowUnionTypes: true });
  var schema;
  switch (basename) {
    case LABS_FILE:
      schema = ajv.compile(labsSchema);
      break;
    case PROJECTS_FILE:
      schema = ajv.compile(projectsSchema);
      break;
    default:
      throw (`unsupported file '${basename}'`);
  }
  if (!schema(content)) {
    throw (`invalid YAML: ${JSON.stringify(schema.errors)}`);
  }
}

export function loadLabs(skipValidation: boolean = false) {
  const filePath = path.join(DATADIR, LABS_FILE)
  console.log(`processing ${filePath}`);
  const content = YAML.parse(fs.readFileSync(filePath, 'utf-8'));
  if (skipValidation) {
    return content;
  }
  validateData(LABS_FILE, content);
  return content;
}

export function loadProjects(skipValidation: boolean = false) {
  const labProjects = fs.readdirSync(DATADIR, { withFileTypes: true }).filter(file => file.isDirectory()).map((file) => {
    const filePath = path.join(file.parentPath, file.name, PROJECTS_FILE);
    console.log(`processing ${filePath}`);
    const content = YAML.parse(fs.readFileSync(filePath, 'utf-8'));
    if (skipValidation) {
      return content;
    }
    console.log(`validating ${filePath}`);
    validateData(PROJECTS_FILE, content);
    content.lab = file.name;
    return content
  });
  return labProjects.map((labProject) => {
    return Object.values(labProject.projects).map((project) => {
      project.lab = labProject.lab;
      project.descriptionDisplay = project.layman_desc ?? project.tech_desc ?? project.description
      project.logo ??= 'https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg'
      return project;
    });
  }).flat()
}
