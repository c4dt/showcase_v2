<script setup lang="ts">
import type Combobox from "~/components/homepage/Combobox.vue";
import type MutliSelectCombobox from "~/components/homepage/mutliSelectCombobox.vue";

const selectedStatus = ref("");
const selectedLab = ref("");
const selectedCategory = ref("");
const selectedApplication = ref("");
const selectedTag = ref("");
const selectedTags = ref<string[]>([]);
provide("selectedTags", selectedTags);

function addTag(tag: string) {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(selectedTags.value.indexOf(tag), 1);
  }
}
provide("addTag", addTag);

const searchQuery = useSearchQuery();

const pprintStatus = [
  `${PROJECT_STATUS_DESC.C4DT_STATUS} ${PROJECT_C4DT_STATUS.ACTIVE} (${PROJECT_STATUS_ICONS[PROJECT_C4DT_STATUS.ACTIVE]})`,
  `${PROJECT_STATUS_DESC.C4DT_STATUS} ${PROJECT_C4DT_STATUS.RETIRED} (${PROJECT_STATUS_ICONS[PROJECT_C4DT_STATUS.RETIRED]})`,
  `${PROJECT_STATUS_DESC.LAB_STATUS} ${PROJECT_LAB_STATUS.ACTIVE} (${PROJECT_STATUS_ICONS[PROJECT_LAB_STATUS.ACTIVE]})`
];

const labsFilter = ref<InstanceType<typeof Combobox>>();
const categoriesFilter = ref<InstanceType<typeof Combobox>>();
const applicationsFilter = ref<InstanceType<typeof Combobox>>();
const TagFilter = ref<InstanceType<typeof MutliSelectCombobox>>();
const statusFilter = ref<InstanceType<typeof Combobox>>();
function resetFilters() {
  categoriesFilter.value?.clearSelection();
  labsFilter.value?.clearSelection();
  applicationsFilter.value?.clearSelection();
  TagFilter.value?.clearAll();
  statusFilter.value?.clearSelection();

  searchQuery.value = "";
  selectedTags.value = [];
}

const projects = useState<ExtendedProject[]>("projects");

let labs: string[] = Array.from(
  new Set(projects.value.map((project) => `${project.lab.prof.name.join(" ")} - ${project.lab.name}`))
);
let categories: string[] = Array.from(new Set(projects.value.flatMap((project) => project.categories)));
let applications: string[] = Array.from(new Set(projects.value.flatMap((project) => project.applications)));

const projectTags: string[] = Array.from(new Set(projects.value.flatMap((project) => project.tags)));

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    return (
      (selectedStatus.value === "" || project.status === pprintStatus.indexOf(selectedStatus.value)) &&
      (selectedTag.value === "" || project.tags.includes(selectedTag.value)) &&
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
</script>

<template>
  <div class="bg-white py-2 sm:px-12">
    <!-- Welcome section and C4DT factory introduction -->
    <section class="isolatept-14 relative lg:px-8">
      <div class="max-w-10xl mx-auto">
        <div class="text-center">
          <h1 class="epfl-h1">The Center for Digital Trust's Showcase</h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            A repository of Digital Trust projects showcasing the latest research and innovation in the field of digital
            trust from the EPFL labs.
          </p>
          <p>-curated by C4DT's factory team-</p>
          <p>
            For more information about the C4DT factory, see
            <a class="epfl-a" href="https://c4dt.epfl.ch/domains/factory/">our homepage</a>
          </p>
          <p>
            You can find more information on <a class="epfl-a" href="https://c4dt.epfl.ch/article/?cat=10">our blog</a>
          </p>
        </div>
      </div>
    </section>
    <!-- Highlighted projects section -->
    <section v-if="!searchQuery" class="py-6">
      <HomepageSelectedProjects />
    </section>
    <!-- Project search section -->
    <section class="px-4 py-4 md:px-12">
      <h2 class="epfl-h2 text-center">View all Projects</h2>
      <div class="flex flex-col py-10 md:flex-row">
        <!-- Sidebar with filter -->
        <div class="w-full md:w-1/4 md:pr-4">
          <div class="top-0 md:sticky">
            <div class="mb-4 rounded-lg border bg-white p-4 shadow-md">
              <div class="font-bold">Filter by</div>
              <HomepageMutliSelectCombobox
                ref="TagFilter"
                v-model="selectedTags"
                title="Tag"
                :item-list="projectTags"
              />
              <homepageCombobox ref="labsFilter" v-model="selectedLab" title="Lab" :item-list="labs" />
              <homepageCombobox ref="statusFilter" v-model="selectedStatus" title="Status" :item-list="pprintStatus" />
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
              <div
                class="mt-4 cursor-pointer truncate rounded-md border border-gray-300 py-2 text-center shadow-xs hover:bg-gray-100"
                @click="resetFilters"
              >
                Reset Filters
              </div>
            </div>
          </div>
        </div>

        <!-- Main projects area -->
        <div class="mt-8 w-full md:mt-0 md:w-3/4">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="my-4 w-full rounded-full bg-gray-200 py-2 pr-4 pl-10 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-300 focus:outline-hidden"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <!-- Clear Button -->
            <button
              v-if="searchQuery"
              class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:text-gray-700"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-for="project in filteredProjects" :key="project.name" class="py-2">
            <homepageProjectCard :project="project" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
