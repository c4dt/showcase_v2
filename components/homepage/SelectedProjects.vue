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
  configuration.value.highlightedProjects.includes(project.id)
);
</script>

<template>
  <div class="text-center">
    <h2 class="epfl-h2">Selected Projects</h2>
  </div>
  <Carousel v-if="highlightedProjects.length > 1" data-testid="carousel" v-bind="carouselConfig" class="mt-12 px-8">
    <Slide v-for="project in highlightedProjects" :key="project.name" data-testid="slide">
      <HomepageCarouselItem data-testid="carousel-item" :project="project" />
    </Slide>
    <template #addons>
      <Navigation data-testid="navigation" />
    </template>
  </Carousel>
  <div v-else class="mt-12 px-8">
    <HomepageCarouselItem data-testid="carousel-item" :project="highlightedProjects[0]" />
  </div>
</template>
