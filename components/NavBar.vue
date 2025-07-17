<script setup lang="ts">
interface NavigationItem {
  name: string;
  href: string;
}

const route = useRoute();

const searchQuery = useSearchQuery();

const searchInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  searchInput.value?.focus(); // Focus the search input when the component is mounted
});

watch(searchQuery, () => {
  // if the search query is empty and the search query in the URL is empty,
  // don't navigate anywhere.
  if (!searchQuery.value && !route.query.search) {
    return;
  }
  navigateTo(`/?search=${encodeURIComponent(searchQuery.value.trim())}`);
});

function formatBreadcrumbName(segment: string): string {
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const navigation = computed<NavigationItem[]>(() => {
  const breadcrumbs = [{ name: "Showcase", href: "/" }];
  const currentPage = route.path.split("/").at(-1);
  if (currentPage) {
    breadcrumbs.push({ name: formatBreadcrumbName(currentPage), href: "#" });
  }
  return breadcrumbs;
});

const clearSearch = () => {
  searchQuery.value = "";
  searchInput.value?.focus();
};
</script>

<template>
  <div class="mx-auto flex h-20 items-center justify-between border-b-2 border-gray-300 px-6">
    <div class="flex items-center gap-2">
      <a href="https://epfl.ch" class="flex">
        <img
          src="https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg?refresh=now"
          alt="EPFL Logo"
          class="h-8 border-r border-gray-400 pr-4"
        />
      </a>
      <a href="https://c4dt.epfl.ch" class="ml-2 pr-8 text-sm leading-tight font-bold md:text-lg">
        CENTER FOR <br />DIGITAL TRUST
      </a>

      <nav aria-label="Breadcrumb">
        <ol class="flex items-center gap-2">
          <li v-for="(item, index) in navigation" :key="item.href" class="flex items-center">
            <RouterLink v-if="index < navigation.length - 1" :to="item.href" class="text-gray-500 hover:text-gray-700">
              {{ item.name }}
            </RouterLink>
            <span v-else class="text-gray-900">{{ item.name }}</span>
            <svg
              v-if="index < navigation.length - 1"
              class="mx-2 h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>
        </ol>
      </nav>
    </div>

    <div class="relative ml-4 w-full max-w-md">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="w-full rounded-full bg-gray-200 py-2 pr-4 pl-10 text-gray-700 transition ring-inset focus:bg-white focus:ring-2 focus:ring-blue-300"
      />
      <svg
        class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:text-gray-700"
        aria-label="Clear search"
        @click="clearSearch"
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
  </div>
</template>
