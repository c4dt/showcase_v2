<script setup lang="ts">
const { data, status, error, refresh, clear } = await useAsyncData(
  'data',
  () => loadProjects()
)

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
            This page presents all projects from the labs affiliated to the
            Center for Digital Trust. You can filter the projects according to
            your preferences. Clicking on one of the projects will show an
            in-depth description.
          </p>
        </div>
      </div>
    </section>
    <section class="px-56 py-24">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Selected Projects
          </h2>
        </div>
      </div>
      <div class="mt-24">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <HomepageCarouselItem />
          <HomepageCarouselItem />
          <HomepageCarouselItem />
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
              <homepageCombobox title="Lab" />
              <homepageCombobox title="Category" />
              <homepageCombobox title="Application" />
            </div>
          </div>
        </div>

        <!-- Main projects area -->
        <div class="w-3/4">
          <!-- Search bar -->
          <div class="sticky border top-0 mb-4 bg-white rounded-xl shadow-md py-2 px-6">
            <div class="flex space-x-4 py-6 justify-center">
              <button class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100">
                ALL
              </button>

              <button class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100">
                E-ID
              </button>

              <button class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100">
                LLMS
              </button>

              <button class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100">
                AI SAFETY
              </button>

              <button class="px-6 py-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-100">
                Cryptography
              </button>
            </div>
            <div class="relative">
              <input type="text" placeholder="Looking for something specific?"
                class="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="space-y-4r">
            <div class="py-4" v-for="project in data">
              <homepageProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>
