<template>
  <div class="bg-white">
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
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
    </div>
    <section class="px-56 py-24">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h2
            class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
          >
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
  </div>
</template>
