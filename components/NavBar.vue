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
    <SearchBar v-model:search-query="searchQuery" v-model:search-input="searchInput" class="ml-4 w-full max-w-md" />
  </div>
</template>
