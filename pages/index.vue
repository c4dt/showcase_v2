<script setup lang="ts">
import type Combobox from "~/components/homepage/Combobox.vue";

interface ProjectConfig {
  highlightedProjects: string[];
}

const selectedLab = ref("");
const selectedCategory = ref("");
const selectedApplication = ref("");
const selectedTags = ref<string[]>([]);
provide("selectedTags", selectedTags);

function addTag(tag: string) {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
}
provide("addTag", addTag);

const searchQuery = useSearchQuery();

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
}

const labsFilter = ref<InstanceType<typeof Combobox>>();
const categoriesFilter = ref<InstanceType<typeof Combobox>>();
const applicationsFilter = ref<InstanceType<typeof Combobox>>();
function resetFilters() {
  categoriesFilter.value?.clearSelection();
  labsFilter.value?.clearSelection();
  applicationsFilter.value?.clearSelection();

  searchQuery.value = "";
  selectedTags.value = [];
}

const { data: projects } = await useFetch<ExtendedProject[]>("/api/projects");
const { data } = await useFetch<ProjectConfig>("/api/configuration");

const projectConfig = ref<ProjectConfig>({
  highlightedProjects: []
});

if (data.value) {
  projectConfig.value = data.value;
}

let labs: string[] = [];
let categories: string[] = [];
let applications: string[] = [];

let highlightedProjects: ExtendedProject[] = [];

if (projects.value) {
  labs = Array.from(
    new Set(projects.value.map((project) => `${project.lab.prof.name.join(" ")} - ${project.lab.name}`))
  );
  categories = Array.from(new Set(projects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(projects.value.flatMap((project) => project.applications)));
  highlightedProjects = projects.value.filter((project) =>
    projectConfig.value.highlightedProjects.includes(project.name)
  );
}

const filteredProjects = computed(() => {
  if (!projects.value) return [];
  return projects.value.filter((project) => {
    return (
      (selectedLab.value === "" || project.lab.name === selectedLab.value.split(" - ")[1]) &&
      (selectedCategory.value === "" || project.categories.includes(selectedCategory.value)) &&
      (selectedApplication.value === "" || project.applications.includes(selectedApplication.value)) &&
      (searchQuery.value === "" || JSON.stringify(project).toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedTags.value.length === 0 || selectedTags.value.some((tag) => project.tags.includes(tag)))
    );
  });
});

watch(filteredProjects, () => {
  labs = Array.from(
    new Set(filteredProjects.value.map((project) => `${project.lab.prof.name.join(" ")} - ${project.lab.name}`))
  );
  categories = Array.from(new Set(filteredProjects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(filteredProjects.value.flatMap((project) => project.applications)));
});

const itemsToShow = ref<number>(10);
const loadMoreProjects = () => {
  itemsToShow.value += 10;
};
const projectsToDisplay = computed<ExtendedProject[]>(() => {
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
          <h3>
            For more information about the C4DT factory, see this link:
            <a
              class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
              href="https://c4dt.epfl.ch/domains/factory/"
              >https://c4dt.epfl.ch/domains/factory/</a
            >
          </h3>
          <h3>
            We also publish articles on our blog at this link:
            <a
              class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
              href="https://c4dt.epfl.ch/article/?cat=10"
              >https://c4dt.epfl.ch/article/?cat=10</a
            >
          </h3>
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
              <homepageCombobox ref="labsFilter" v-model="selectedLab" title="Lab" :item-list="labs" />
              <homepageCombobox
                ref="categoriesFilter"
                v-model="selectedCategory"
                title="Category"
                :item-list="categories"
              />
              <homepageCombobox
                ref="applicationsFilter"
                v-model="selectedApplication"
                title="Application"
                :item-list="applications"
              />
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
