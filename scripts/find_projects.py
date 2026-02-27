#!/usr/bin/env python3

"""
:synopsis: Get unit's GitHub repositories.
"""


# standard library imports
import os
import yaml
import json
import pprint
import pathlib
import datetime
import requests
import tempfile
import collections

# third party imports
# library specific imports


UNAUTHENTICATED_RATE_LIMIT = 60
HEADERS = {
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
    "X-GitHub-Api-Version": "2022-11-28",
}


def get_org(url):
    """Get GitHub organisation from GitHub URL.

    :param str url: GitHub URL

    :returns: organisation
    :rtype: str
    """
    if url.startswith("git@"):
        path = url.removeprefix("git@github.com:")
    if url.startswith("http://"):
        path = url.removeprefix("http://github.com/")
    else:
        path = url.removeprefix("https://github.com/")
    return path.split("/")[0].lower()


def get_orgs(file_path):
    """Get unit's GitHub organisations.

    :param pathlib.Path file_path: path to unit's projects.yaml

    :returns: GitHub organisations
    :rtype: list
    """
    with file_path.open() as fp:
        data = yaml.safe_load(fp)
    orgs = collections.defaultdict(list)
    for project in data["projects"].values():
        if not "code" in project:
            continue
        url = project["code"].get("url", "")
        if not "github.com" in url:
            continue
        orgs[get_org(url)].append(url)
    return orgs


def get_repos(org):
    """Get unit's GitHub repositories.

    :param str org: GitHub organisation
    """
    # https://github.com/arturog8m/github-org-repo-lister/blob/main/list_github_org_repos.py
    repos = []
    page = 1
    while True:
        response = requests.get(
            f"https://api.github.com/orgs/{org}/repos",
            headers=HEADERS,
            params={"page": page},
        )
        if response.status_code != 200:
            print(response.status_code)
            break
        data = response.json()
        if not data:
            break
        for repo in data:
            if repo["archived"]:
                print(f"{repo['html_url']} has been archived")
                continue
            if repo["disabled"]:
                print(f"{repo['html_url']} has been disabled")
                continue
            if (
                datetime.datetime.fromisoformat(repo["created_at"]).year
                < datetime.datetime.now().year - 1
            ):
                print(f"{repo['html_url']} has been created over 1 year ago")
                continue
            repo_response = requests.get(
                f"https://api.github.com/repos/{org}/{repo['name']}/readme",
                headers=HEADERS,
                params={"page": page},
            )
            if repo_response.status_code != 200:
                print(repo_response.status_code)
                break
            repo_data = repo_response.json()
            if not repo_data:
                repos.append([repo["html_url"], ""])
                break
            else:
                repos.append([repo["html_url"], repo_data["download_url"]])
        if len(data) < 30:
            break
        page += 1
    return repos


def main():
    """Main routine."""
    intermediate_units = {}
    for file_path in (
            pathlib.Path(__file__).parent.parent / "data"
    ).glob("*/projects.yaml"):
        intermediate_units[file_path.parent.name.upper()] = get_orgs(file_path)
    temp_json = pathlib.Path(tempfile.gettempdir()) / "intermediate_units.json"
    with (temp_json).open("w") as fp:
        json.dump(intermediate_units, fp)
        print(f"intermediate outputs written to {temp_json}")
    units = collections.defaultdict(lambda: collections.defaultdict(dict))
    for i, (unit, orgs) in enumerate(intermediate_units.items(), start=1):
        print(f"[{i}/{len(intermediate_units)}] retrieve list of projects of {unit}")
        for org, intermediate_repos in orgs.items():
            units[unit][org]["old"] = intermediate_repos
            # for some units C4DT used to host the repositories
            if unit == "C4DT" and org != "c4dt":
                units[unit][org]["new"] = []
            else:
                repos = get_repos(org)
                units[unit][org]["new"] = [
                    repo for repo in repos
                    if repo[0] not in intermediate_repos
                ]
    temp_json = pathlib.Path(tempfile.gettempdir()) / "units.json"
    with (temp_json).open("w") as fp:
        json.dump(units, fp)
        print(f"outputs written to {temp_json}")


if __name__ == "__main__":
    main()
