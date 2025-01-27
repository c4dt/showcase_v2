<script setup lang="ts">
const { data } = await useAsyncData("data", () => loadProjects());
const projects = data.value;
const carouselProjects = projects.filter((project: any) => project.is_highlighted);

const labs = Array.from(new Set(projects.map((project: any) => project.lab)));
const categories = Array.from(new Set(projects.map((project: any) => project.categories).flat()));
const applications = Array.from(new Set(projects.map((project: any) => project.applications).flat()));

const highlightedTags = ref<Record<string, string>>({
  ALL: "",
  "Distributed Learning": "Distributed Learning",
  "ZK Proofs": "Zero-Knowledge Proofs",
  Encryption: "Encryption",
  Optimization: "Optimization"
});

const selectedLab = ref("");
const selectedCategory = ref("");
const selectedApplication = ref("");
const selectedTag = ref("");
const searchQuery = ref("");

const filteredProjects = computed(() => {
  return projects.filter((project: any) => {
    return (
      (selectedLab.value === "" || project.lab === selectedLab.value) &&
      (selectedCategory.value === "" || project.categories.includes(selectedCategory.value)) &&
      (selectedApplication.value === "" || project.applications.includes(selectedApplication.value)) &&
      (selectedTag.value === "" || project.tags.includes(selectedTag.value)) &&
      (searchQuery.value === "" || project.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  });
});

function filterByTag(tag: string) {
  selectedTag.value = tag;
}
</script>

<template>
  <div class="bg-white">
    <section class="relative isolate px-6 pt-14 lg:px-8">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to the Center for Digital Trust's Showcase
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            This page presents all projects from the labs affiliated to the Center for Digital Trust. You can filter the
            projects according to your preferences. Clicking on one of the projects will show an in-depth description.
          </p>
        </div>
      </div>
    </section>
    <section class="px-56 py-24">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Selected Projects</h2>
        </div>
      </div>
      <div class="mt-24">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <HomepageCarouselItem v-for="project in carouselProjects" :project="project" />
        </div>
      </div>
    </section>
    <section class="px-56 py-24">
      <div class="flex">
        <!-- Sidebar with filter -->
        <div class="w-1/4 pr-4">
          <div class="sticky top-0">
            <div class="bg-white p-4 border rounded-lg shadow-md mb-4">
              <div class="font-bold">Filter by</div>
              <homepageCombobox v-model="selectedLab" title="Lab" :item-list="labs" />
              <homepageCombobox v-model="selectedCategory" title="Category" :item-list="categories" />
              <homepageCombobox v-model="selectedApplication" title="Application" :item-list="applications" />
            </div>
          </div>
        </div>

        <!-- Main projects area -->
        <div class="w-3/4">
          <!-- Search bar -->
          <div class="sticky border top-0 mb-4 bg-white rounded-xl shadow-md py-2 px-6">
            <ul class="flex space-x-4 py-6 justify-center">
              <li
                v-for="(value, key) in highlightedTags"
                :key="key"
                class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100"
                :class="[
                  'px-6 py-2 border rounded-md shadow-sm cursor-pointer',
                  selectedTag === value ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                ]"
                @click="filterByTag(value)"
              >
                {{ key }}
              </li>
            </ul>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Looking for something specific?"
                class="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
          <div class="space-y-4r">
            <div v-for="project in filteredProjects" class="py-4">
              <homepageProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
