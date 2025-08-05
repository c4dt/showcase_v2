<script lang="ts" setup>
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";

const carouselConfig = {
  itemsToShow: 1,
  height: 500,
  gap: 10,
  autoplay: 4000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
  breakpointMode: "carousel",
  breakpoints: {
    400: {
      itemsToShow: 2,
      snapAlign: "start"
    },
    800: {
      itemsToShow: 3,
      snapAlign: "start"
    },
    1100: {
      itemsToShow: 4,
      snapAlign: "start"
    }
  }
};

const configuration = useState<Configuration>("configuration");
const projects = useState<ExtendedProject[]>("projects");

const highlightedProjects: ExtendedProject[] = projects.value.filter((project) =>
  configuration.value.highlightedProjects.includes(project.name)
);
</script>

<template>
  <div class="text-center">
    <h2 class="epfl-h2">Selected Projects</h2>
  </div>
  <Carousel class="mt-12 px-8" v-bind="carouselConfig">
    <Slide v-for="project in highlightedProjects" :key="project.name">
      <HomepageCarouselItem :project="project" />
    </Slide>

    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>
