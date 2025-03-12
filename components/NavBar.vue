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
  const segments = route.path.split("/").filter(Boolean);
  const breadcrumbs: NavigationItem[] = [{ name: "Showcase", href: "/" }];

  segments.forEach((segment, index) => {
    breadcrumbs.push({
      name: formatBreadcrumbName(segment),
      href: "/" + segments.slice(0, index + 1).join("/")
    });
  });

  return breadcrumbs;
});
</script>

<template>
  <div class="flex h-20 mx-auto px-6 border-b-2 border-gray-300 items-center justify-between">
    <div class="flex items-center gap-2">
      <a href="https://epfl.ch" class="flex">
        <img
          src="https://c4dt.epfl.ch/wp-content/themes/epfl/assets/svg/epfl-logo.svg?refresh=now"
          alt="EPFL Logo"
          class="h-8 border-r border-gray-400 pr-4"
        />
      </a>
      <a href="https://c4dt.epfl.ch" class="ml-2 pr-8 text-sm md:text-lg font-bold leading-tight">
        CENTER FOR <br />DIGITAL TRUST
      </a>

      <nav aria-label="Breadcrumb">
        <ol class="flex items-center gap-2">
          <li v-for="(item, index) in navigation" :key="item.href" class="flex items-center">
            <RouterLink :to="item.href" class="text-gray-500 hover:text-gray-700">
              {{ item.name }}
            </RouterLink>
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
        class="w-full rounded-full bg-gray-200 py-2 pl-10 pr-4 text-gray-700 ring-inset transition focus:bg-white focus:ring-2 focus:ring-blue-300"
      />
      <svg
        class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
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
    </div>
  </div>
</template>
