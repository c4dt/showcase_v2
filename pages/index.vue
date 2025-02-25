<script setup lang="ts">
interface Project {
  id: string;
  name: string;
  logo: string;
  descriptionDisplay: string;
  information: { url: string }[];
  is_highlighted: boolean;
  lab: { name: string; url: string };
  url: string;
  code: { url: string; type: string };
  categories: string[];
  applications: string[];
  tags: string[];
  description: string;
}

interface ProjectConfig {
  highlightedTags: string[];
  highlightedProjects: string[];
}

const selectedLab = ref("");
const selectedCategory = ref("");
const selectedApplication = ref("");
const selectedHighlightedTag = ref("");
const selectedTags = ref<string[]>([]);
provide("selectedTags", selectedTags);

function addTag(tag: string) {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
}
provide("addTag", addTag);

const searchQuery = inject("searchQuery") as Ref<string>;

function filterByTag(tag: string) {
  selectedHighlightedTag.value = tag;
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
}

function resetFilters() {
  selectedLab.value = "";
  selectedCategory.value = "";
  selectedApplication.value = "";
  selectedHighlightedTag.value = "";
  searchQuery.value = "";
  selectedTags.value = [];
}

const route = useRoute();
const queryParams = route.query;
const searchQueryParam = queryParams.search as string;

if (searchQueryParam) {
  searchQuery.value = searchQueryParam;
}

watch(route.query, () => {
  searchQuery.value = (route.query.search as string) || "";
});

const { data: projects } = await useFetch<Project[]>("/api/projects");
const { data } = await useFetch<ProjectConfig>("/api/configuration");

const projectConfig = ref<ProjectConfig>({
  highlightedTags: [],
  highlightedProjects: []
});

if (data.value) {
  projectConfig.value = data.value;
}

let labs: string[] = [];
let categories: string[] = [];
let applications: string[] = [];

let highlightedProjects: Project[] = [];
let highlightedTags: string[] = [];

if (projects.value) {
  labs = Array.from(new Set(projects.value.map((project) => project.lab.name)));
  categories = Array.from(new Set(projects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(projects.value.flatMap((project) => project.applications)));
  highlightedProjects = projects.value.filter((project) =>
    projectConfig.value.highlightedProjects.includes(project.name)
  );
  highlightedTags = projectConfig.value.highlightedTags;
}

const filteredProjects = computed(() => {
  if (!projects.value) return [];
  return projects.value.filter((project) => {
    return (
      (selectedLab.value === "" || project.lab.name === selectedLab.value) &&
      (selectedCategory.value === "" || project.categories.includes(selectedCategory.value)) &&
      (selectedApplication.value === "" || project.applications.includes(selectedApplication.value)) &&
      (selectedHighlightedTag.value === "" || project.tags.includes(selectedHighlightedTag.value)) &&
      (searchQuery.value === "" || project.name.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedTags.value.length === 0 || selectedTags.value.some((tag) => project.tags.includes(tag)))
    );
  });
});

watch(filteredProjects, () => {
  labs = Array.from(new Set(filteredProjects.value.map((project) => project.lab.name)));
  categories = Array.from(new Set(filteredProjects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(filteredProjects.value.flatMap((project) => project.applications)));
});

const itemsToShow = ref<number>(10);
const loadMoreProjects = () => {
  itemsToShow.value += 10;
};
const projectsToDisplay = computed<Project[]>(() => {
  return filteredProjects.value.slice(0, itemsToShow.value);
});
</script>

<template>
  <div class="sm:px-12 py-2 bg-white">
    <!-- Welcome section and C4DT factory introduction -->
    <section class="relative isolatept-14 lg:px-8">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The Center for Digital Trust's Showcase
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            A repository of Digital Trust projects showcasing the latest research and innovation in the field of digital
            trust from the EPFL labs.
          </p>
          <p>-curated by C4DT's factory team-</p>
        </div>
      </div>
    </section>
    <!-- Highlighted projects section -->
    <section v-if="!searchQuery" class="py-6">
      <HomepageSelectedProjects :highlightedProjects="highlightedProjects" />
    </section>
    <!-- Project search section -->
    <section class="px-4 md:px-12 py-4">
      <h1 class="text-center text-3xl font-bold text-gray-900 sm:text-5xl">View all Projects</h1>
      <div class="flex flex-col md:flex-row py-10">
        <!-- Sidebar with filter -->
        <div class="w-full md:w-1/4 md:pr-4">
          <div class="md:sticky top-0">
            <div class="bg-white p-4 border rounded-lg shadow-md mb-4">
              <div class="font-bold">Filter by</div>
              <homepageCombobox v-model="selectedLab" title="Lab" :item-list="labs" />
              <homepageCombobox v-model="selectedCategory" title="Category" :item-list="categories" />
              <homepageCombobox v-model="selectedApplication" title="Application" :item-list="applications" />
              <div class="flex flex-wrap space-x-2 space-y-2">
                <div
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                >
                  <span>{{ tag }}</span>
                  <button
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Remove tag"
                    @click="removeTag(tag)"
                  >
                    x
                  </button>
                </div>
              </div>
              <div
                class="text-center py-2 border border-gray-300 rounded-md shadow-xs hover:bg-gray-100 cursor-pointer mt-4"
                @click="resetFilters"
              >
                Reset Filters
              </div>
            </div>
          </div>
        </div>

        <!-- Main projects area -->
        <div class="w-full md:w-3/4 mt-8 md:mt-0">
          <!-- Highlighted tags and search -->
          <div class="md:sticky border top-0 mb-4 bg-white rounded-xl shadow-md py-2 px-6">
            <h2 class="text-3xl text-center">Trending tags</h2>
            <ul class="flex flex-wrap md:flex-nowrap space-x-2 space-y-2 py-4 justify-center">
              <li
                v-for="tag in highlightedTags"
                :key="tag"
                class="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-xs flex-grow text-center"
                :class="selectedHighlightedTag === tag ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-400'"
                @click="filterByTag(tag)"
              >
                {{ tag === "" ? "ALL" : tag }}
              </li>
            </ul>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Enter a project name..."
                class="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div v-for="project in projectsToDisplay" :key="project.name" class="py-2">
            <homepageProjectCard :project="project" />
          </div>
          <!-- Load more button -->
          <div class="flex justify-center mt-4">
            <button
              v-if="itemsToShow < filteredProjects.length"
              class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
              @click="loadMoreProjects"
            >
              Load more projects
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
