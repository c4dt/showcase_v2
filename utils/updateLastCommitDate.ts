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

async function getGithubOrgLastCommitDate(orgName: string): Promise<string | undefined> {
  const reposURL = `https://api.github.com/orgs/${orgName}/repos?per_page=1&sort=updated&direction=desc`;
  try {
    const response = await fetch(reposURL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Ensure GITHUB_TOKEN is set in your environment
        Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`
      }
    });
    if (!response.ok) {
      console.error(`Failed to get repos for: ${orgName}. HTTP status: ${response.status}`);
      return;
    }
    const lastCommitDate = (await response.json())[0]?.pushed_at;
    if (!lastCommitDate) {
      console.error(`Last repo in org ${orgName} Doesn't have any commits.`);
      return;
    }

    return lastCommitDate.split("T")[0];
  } catch (error) {
    console.error(`Error fetching repos for org: ${orgName}`);
    console.error(error);
    return;
  }
}

async function getGithubProjectLastCommitDate(orgName: string, repoName: string): Promise<string | undefined> {
  const commitsURL = `https://api.github.com/repos/${orgName}/${repoName}/commits?per_page=1`;

  try {
    const response = await fetch(commitsURL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Ensure GITHUB_TOKEN is set in your environment
        Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to get commits for: ${orgName}/${repoName}. HTTP status: ${response.status}`);
      return;
    }

    const commits = (await response.json()) as GitHubCommit[];

    if (!Array.isArray(commits) || commits.length === 0) {
      console.error(`No commits found for: ${orgName}/${repoName}.`);
      return;
    }

    const lastCommitDate = commits[0]?.commit?.author?.date;
    if (!lastCommitDate) {
      console.error(`Could not retrieve commit date from: ${orgName}/${repoName}`);
      return;
    }

    return lastCommitDate.split("T")[0];
  } catch (error) {
    console.error(`Error fetching commit for repo: ${orgName}/${repoName}`);
    console.error(error);
    return;
  }
}

async function getGitlabOrgLastCommitDate(orgName: string): Promise<string | undefined> {
  const reposURL = `https://gitlab.com/api/v4/groups/${orgName}/projects?per_page=1&order_by=last_activity_at`;
  try {
    const response = await fetch(reposURL, {
      headers: {
        Accept: "application/json"
      }
    });
    if (!response.ok) {
      console.error(`Failed to get repos for: ${orgName}. HTTP status: ${response.status}`);
      return;
    }
    const lastCommitDate = (await response.json())[0]?.last_activity_at;
    if (!lastCommitDate) {
      console.error(`Last repo in org ${orgName} doesn't have any commits.`);
      return;
    }

    return lastCommitDate.split("T")[0];
  } catch (error) {
    console.error(`Error fetching repos for org: ${orgName}`);
    console.error(error);
    return;
  }
}

async function getGitlabProjectLastCommitDate(orgName: string, repoName: string): Promise<string | undefined> {
  const commitsURL = `https://gitlab.com/api/v4/projects/${orgName}%2F${repoName}/repository/commits?per_page=1`;
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
    console.error(`No commits found for: ${orgName}/${repoName}.`);
    return;
  }

  return commits[0].committed_date.split("T")[0];
}

/**
 * Fetches the latest commit date in YYYY-MM-DD format from the provided GitHub repository URL.
 * Returns null if the data cannot be retrieved for any reason.
 */
async function getProjectLastCommitDate(gitRepo: string): Promise<string | undefined> {
  const url = new URL(gitRepo);

  const repoService = url.host;
  const pathParts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");

  if (repoService !== "github.com" && repoService !== "gitlab.com") {
    console.error(`Unsupported repository service: ${repoService}. Only GitHub and GitLab are supported.`);
    return;
  }
  if (pathParts.length === 0 || pathParts.length > 2) {
    console.error(`Unrecognizable  URL: ${gitRepo}. Ensure it follows "https://github.com/owner/repo" format.`);
    return;
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
      const lastCommitDate = await getProjectLastCommitDate(project.code.url);
      if (!lastCommitDate) {
        continue;
      }

      project.code.date_last_commit = lastCommitDate;
      labProjects.projects[projectId] = project;
      updatedProjectsCount++;
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
