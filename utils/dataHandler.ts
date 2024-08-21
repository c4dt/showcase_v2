// standard library imports
import fs from 'fs';
import path from 'path';

// third party imports
import YAML from 'yaml';
import Ajv from 'ajv';

// local imports
import labsSchema from './schemas/labs.json'
import projectsSchema from './schemas/projects.json'


function loadData(src: string, toValidate: boolean = true){
  const content = YAML.parse(fs.readFileSync(src, 'utf-8'))
  if (!toValidate) {
    return content;
  }
  const basename = path.basename(src);
  const ajv = new Ajv();
  var schema;
  switch (basename) {
    case 'labs.yaml':
      schema = ajv.compile(labsSchema);
      break;
    case 'projects.yaml':
      schema = ajv.compile(projectsSchema);
      break;
    default:
      throw(`unsupported file '${basename}'`);
  }
  if (!schema(content)) {
    throw(`invalid YAML: ${JSON.stringify(schema.errors)}`);
  }
  return content;
}

console.log(loadData('./data/DEDIS/projects.yaml'));  // this file is invalid
