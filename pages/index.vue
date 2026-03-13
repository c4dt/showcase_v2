<script setup lang="ts">
import type Combobox from "~/components/homepage/Combobox.vue";
import type MutliSelectCombobox from "~/components/homepage/mutliSelectCombobox.vue";

const config = useRuntimeConfig();

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

const labsFilter = ref<InstanceType<typeof Combobox>>();
const categoriesFilter = ref<InstanceType<typeof Combobox>>();
const applicationsFilter = ref<InstanceType<typeof Combobox>>();
const TagFilter = ref<InstanceType<typeof MutliSelectCombobox>>();
const statusFilter = ref<InstanceType<typeof Combobox>>();
const selectedEvaluators = ref<string[]>([]);

function resetFilters() {
  categoriesFilter.value?.clearSelection();
  labsFilter.value?.clearSelection();
  applicationsFilter.value?.clearSelection();
  TagFilter.value?.clearAll();
  statusFilter.value?.clearSelection();

  searchQuery.value = "";
  selectedTags.value = [];
  selectedEvaluators.value = [];
}

function toggleEvaluator(key: string) {
  const idx = selectedEvaluators.value.indexOf(key);
  if (idx === -1) {
    selectedEvaluators.value = [...selectedEvaluators.value, key];
  } else {
    selectedEvaluators.value = selectedEvaluators.value.filter((k) => k !== key);
  }
}

const projects = useState<ExtendedProject[]>("projects");

function pprintLab(project: ExtendedProject): string {
  return `${project.lab.prof.name[project.lab.prof.name.length - 1].toUpperCase()}, ${project.lab.prof.name.slice(0, -1).join(" ")} - ${project.lab.name}`;
}

let labs: string[] = Array.from(new Set(projects.value.map(pprintLab)));
let categories: string[] = Array.from(new Set(projects.value.flatMap((project) => project.categories)));
let applications: string[] = Array.from(new Set(projects.value.flatMap((project) => project.applications)));

const projectTags: string[] = Array.from(new Set(projects.value.flatMap((project) => project.tags)));

const evaluatorKeys = config.public.evaluateMode
  ? Array.from(
      new Set(projects.value.flatMap((p) => Object.keys((p.showcase_interest as Record<string, number>) ?? {})))
    ).sort()
  : [];

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    return (
      (selectedStatus.value === "" ||
        selectedStatus.value === PPRINTED_C4DT_STATUS[project.c4dt_status] ||
        selectedStatus.value === PPRINTED_LAB_STATUS[project.lab_status] ||
        (selectedStatus.value === PROPOSAL_2026_STATUS && project.tags.includes(PROPOSAL_2026_STATUS))) &&
      (selectedTag.value === "" || project.tags.includes(selectedTag.value)) &&
      (selectedLab.value === "" || project.lab.name === selectedLab.value.split(" - ")[1]) &&
      (selectedCategory.value === "" || project.categories.includes(selectedCategory.value)) &&
      (selectedApplication.value === "" || project.applications.includes(selectedApplication.value)) &&
      (searchQuery.value === "" || JSON.stringify(project).toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedTags.value.length === 0 || selectedTags.value.some((tag) => project.tags.includes(tag)))
    );
  });
});

const sortedProjects = computed(() => {
  if (!config.public.evaluateMode || selectedEvaluators.value.length === 0) {
    return filteredProjects.value;
  }
  return [...filteredProjects.value].sort((a, b) => {
    const scores = (p: ExtendedProject) =>
      selectedEvaluators.value.reduce((sum, key) => {
        const interest = (p.showcase_interest as Record<string, number>) ?? {};
        return sum + (interest[key] ?? 0);
      }, 0);
    return scores(b) - scores(a);
  });
});

watch(filteredProjects, () => {
  labs = Array.from(new Set(filteredProjects.value.map(pprintLab)));
  categories = Array.from(new Set(filteredProjects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(filteredProjects.value.flatMap((project) => project.applications)));
});
</script>

<template>
  <html lang="en">
    <div class="mx-auto bg-white px-6 py-6">
      <!-- Welcome section and C4DT factory introduction -->
      <section class="isolatept-14 relative lg:px-8">
        <div class="max-w-10xl mx-auto">
          <div class="text-center">
            <h1 class="epfl-h1">The Center for Digital Trust's Showcase</h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              A repository of Digital Trust projects showcasing the latest research and innovation in the field of
              digital trust from the EPFL labs.
            </p>
            <p>-curated by C4DT's factory team-</p>
            <p>
              For more information about the C4DT factory, see
              <a class="epfl-a" href="https://c4dt.epfl.ch/domains/factory/">our homepage</a>
            </p>
            <p>
              You can find more information on
              <a class="epfl-a" href="https://c4dt.epfl.ch/article/?cat=10">our blog</a>
            </p>
          </div>
        </div>
      </section>
      <!-- Highlighted projects section -->
      <section v-if="!searchQuery" class="py-6">
        <HomepageSelectedProjects />
      </section>
      <!-- Project search section -->
      <section class="py-4">
        <h2 class="epfl-h2 text-center">View all Projects</h2>
        <div class="flex flex-col py-10 lg:flex-row">
          <!-- Sidebar with filter -->
          <div class="w-full lg:w-30/100 lg:pr-4">
            <div class="top-0 lg:sticky">
              <div class="epfl-filterbox">
                <div class="text-xl">Filter projects</div>
                <HomepageMutliSelectCombobox
                  ref="TagFilter"
                  v-model="selectedTags"
                  title="Tag"
                  :item-list="projectTags"
                />
                <homepageCombobox ref="labsFilter" v-model="selectedLab" title="Lab" :item-list="labs" />
                <homepageCombobox
                  ref="statusFilter"
                  v-model="selectedStatus"
                  title="Support"
                  :item-list="PPRINTED_STATUS"
                />
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
                <div class="epfl-button-plain" @click="resetFilters">Reset Filters</div>
              </div>
            </div>
          </div>

          <!-- Main projects area -->
          <div class="mt-8 w-full lg:mt-0 lg:w-70/100">
            <!-- Search -->
            <SearchBar v-model:search-query="searchQuery" class="my-4" />
            <div v-if="config.public.evaluateMode" class="my-4">
              <div class="flex flex-row gap-4">
                <button
                  v-for="key in evaluatorKeys"
                  :key="key"
                  :data-testid="`evaluator-btn-${key}`"
                  :class="['epfl-button-plain', 'px-4', selectedEvaluators.includes(key) ? 'bg-[#d5d5d5]' : '']"
                  @click="toggleEvaluator(key)"
                >
                  {{ key }}
                </button>
              </div>
            </div>
            <HomepageNoResultsMessage v-if="sortedProjects.length === 0" />
            <div
              v-for="project in sortedProjects"
              :key="project.name"
              :data-testid="`project-${project.id}`"
              class="py-2"
            >
              <homepageProjectCard :project="project" />
              <div
                v-if="config.public.evaluateMode"
                :data-testid="`evaluations-${project.id}`"
                class="flex gap-4 px-2 py-1 text-sm text-gray-500"
              >
                <span
                  v-for="(score, evaluator) in project.showcase_interest as Record<string, number>"
                  :key="evaluator"
                >
                  {{ evaluator }}: {{ score }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </html>
</template>
