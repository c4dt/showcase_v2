/*
A script to update the last commit date for all projects that have a code repository.
The script uses the GitHub API to retrieve the relevant date.
*/

import fs from "fs/promises";
import path from "path";
import yaml, { parseDocument } from "yaml";
import type { Projects } from "~/types/projects";

const DATA_DIR = "./data";
const PRODUCTS_DIR = "customHTMLContent";
const PROJECTS_FILE = "projects.yaml";

async function getProjectFilesPaths(): Promise<string[]> {
  const allEntries = await fs.readdir(DATA_DIR, { withFileTypes: true });
  const projectLabsDirectories = allEntries
    .filter((entry) => entry.isDirectory() && entry.name !== PRODUCTS_DIR)
    .map((entry) => path.join(DATA_DIR, entry.name, PROJECTS_FILE));

  return projectLabsDirectories;
}

async function readProjectsFromFile(filePath: string): Promise<Projects> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  return yaml.parse(fileContent) as Projects;
}

/**
 * A minimal interface to represent the piece of data we need from the GitHub API.
 * Adjust fields as needed if you want more data from the commit object.
 */
interface GitHubCommit {
  commit: {
    author: {
      date: string;
    };
  };
}

async function getGithubOrgLastCommitDate(orgName: string): Promise<string> {
  const reposURL = `https://api.github.com/orgs/${orgName}/repos?per_page=1&sort=pushed&direction=desc`;
  const response = await fetch(reposURL, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Ensure GITHUB_TOKEN is set in your environment
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`
    }
  });
  if (!response.ok) {
    throw Error(`Failed to get repos for: ${orgName}. HTTP status: ${response.status}`);
  }
  const lastCommitDate = (await response.json())[0]?.pushed_at;
  if (!lastCommitDate) {
    throw Error(`Last repo in org ${orgName} Doesn't have any commits.`);
  }

  return lastCommitDate.split("T")[0];
}

async function getGithubProjectLastCommitDate(orgName: string, repoName: string): Promise<string> {
  const commitsURL = `https://api.github.com/repos/${orgName}/${repoName}/commits?per_page=1`;
  const response = await fetch(commitsURL, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Ensure GITHUB_TOKEN is set in your environment
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`
    }
  });

  if (!response.ok) {
    throw Error(`Failed to get commits for: ${orgName}/${repoName}. HTTP status: ${response.status}`);
  }

  const commits = (await response.json()) as GitHubCommit[];

  if (!Array.isArray(commits) || commits.length === 0) {
    throw Error(`No commits found for: ${orgName}/${repoName}.`);
  }

  const lastCommitDate = commits[0]?.commit?.author?.date;
  if (!lastCommitDate) {
    throw Error(`Could not retrieve commit date from: ${orgName}/${repoName}`);
  }

  return lastCommitDate.split("T")[0];
}

async function getGitlabOrgLastCommitDate(orgName: string): Promise<string> {
  const reposURL = `https://gitlab.com/api/v4/groups/${orgName}/projects?per_page=1&order_by=last_activity_at`;
  const response = await fetch(reposURL, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw Error(`GitLab API error: ${response.status} ${response.statusText}`);
  }
  const lastCommitDate = (await response.json())[0]?.last_activity_at;
  if (!lastCommitDate) {
    throw Error(`Last repo in org ${orgName} doesn't have any commits.`);
  }

  return lastCommitDate.split("T")[0];
}

async function getGitlabProjectLastCommitDate(orgName: string, repoName: string): Promise<string> {
  const commitsURL = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${orgName}/${repoName}`)}/repository/commits?per_page=1`;
  const resp = await fetch(commitsURL, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!resp.ok) {
    throw new Error(`GitLab API error: ${resp.status} ${resp.statusText}`);
  }

  const commits = await resp.json();
  if (commits.length === 0) {
    throw new Error(`No commits found for: ${orgName}/${repoName}.`);
  }

  return commits[0].committed_date.split("T")[0];
}

/**
 * Fetches the latest commit date in YYYY-MM-DD format from the provided repository URL.
 * Supports both GitHub and GitLab repositories.
 * Throws an Error if the data cannot be retrieved or if the repository format is invalid.
 */
async function getProjectLastCommitDate(gitRepo: string): Promise<string> {
  const url = new URL(gitRepo);

  const repoService = url.host;
  const pathParts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");

  if (repoService !== "github.com" && repoService !== "gitlab.com") {
    throw Error(`Unsupported repository service: ${repoService}. Only GitHub and GitLab are supported.`);
  }
  if (pathParts.length === 0 || pathParts.length > 2) {
    throw Error(`Invalid repository path: ${url.pathname}. Expected format: /owner/repo or /owner for organization.`);
  }

  switch (`${repoService},${pathParts.length}`) {
    case "github.com,1":
      return await getGithubOrgLastCommitDate(pathParts[0]);
    case "github.com,2":
      return await getGithubProjectLastCommitDate(pathParts[0], pathParts[1]);
    case "gitlab.com,1":
      return await getGitlabOrgLastCommitDate(pathParts[0]);
    case "gitlab.com,2":
      return await getGitlabProjectLastCommitDate(pathParts[0], pathParts[1]);
    default:
      throw Error(`Unsupported repository format: ${url.pathname}`);
  }
}

/**
 * Updates a projects file changing only the `date_last_commit` field,
 * while maintaining the rest of file without any changes.
 */
async function updateProjectFile(filePath: string, labProjects: Projects): Promise<void> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const yamlDoc = parseDocument(fileContent, { strict: false });

  for (const [projectId, project] of Object.entries(labProjects.projects)) {
    if (project.code?.date_last_commit) {
      yamlDoc.setIn(["projects", projectId, "code", "date_last_commit"], project.code.date_last_commit);
    }
  }
  await fs.writeFile(filePath, String(yamlDoc), "utf-8");
}

/**
 * Iterates through all project YAML files found in the DATA_DIR,
 * updating the date_last_commit for each project that has a code repository specified.
 */
async function updateLastCommitDate(): Promise<void> {
  let updatedProjectsCount = 0;

  const projectsPaths = await getProjectFilesPaths();

  for (const projectsPath of projectsPaths) {
    const labProjects = await readProjectsFromFile(projectsPath);

    for (const [projectId, project] of Object.entries(labProjects.projects)) {
      if (!project.code) {
        continue;
      }
      if (!project.code.url) {
        console.warn(`No repository URL found for project: ${projectId}`);
        continue;
      }
      try {
        const lastCommitDate = await getProjectLastCommitDate(project.code.url);
        project.code.date_last_commit = lastCommitDate;
        labProjects.projects[projectId] = project;
        updatedProjectsCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Project: ${projectId} - Error: ${errorMessage}`);
      }
    }

    // Update the YAML file with new data for every project in the file
    await updateProjectFile(projectsPath, labProjects);
  }

  console.log(`Checked and updated ${updatedProjectsCount} projects.`);
}

/**
 * Runs the update process.
 * We wrap it in an immediately-invoked async function to handle any top-level errors and exit cleanly.
 */
(async function main() {
  try {
    await updateLastCommitDate();
  } catch (error) {
    console.error("An unexpected error occurred while updating last commit dates.");
    console.error(error);
    process.exit(1);
  }
})();
