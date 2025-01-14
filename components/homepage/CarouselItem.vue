<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);
</script>

<template>
  <div
    class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100">
    <img alt="Dela" src="https://dedis.github.io/dela/assets/logo.png"
      class="pt-4 pr-4 pl-4 object-cover w-full h-auto">
    <div
      class="relative bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none !m-0 p-6">
      <h5
        class="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 capitalize">
        DEDIS Ledger Architecture
      </h5>
      <p class="block antialiased font-sans text-sm leading-normal text-inherit font-normal !text-gray-500">
        Dela stands for DEDIS Ledger Architecture. It is both a set of
        abstractions and an implementation of a distributed ledger architecture.
      </p>
    </div>
    <div class="flex space-x-4 justify-end pb-4 pr-4">
      <a href="https://github.com/dedis/dela/blob/main/docs">
        <div class="text-right">
          <font-awesome :icon="['fa', 'newspaper']" class="fa-3x" />
        </div>
      </a>
      <a href="https://dedis.github.io/dela/#/">
        <div class="text-right">
          <font-awesome :icon="['fa', 'home']" class="fa-3x" />
        </div>
      </a>
      <a href="https://github.com/dedis/dela">
        <div class="text-right">
          <font-awesome :icon="['fab', 'github']" class="fa-3x" />
        </div>
      </a>
    </div>
  </div>
</template>
