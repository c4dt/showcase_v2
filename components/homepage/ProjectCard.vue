<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8">
      <div class="flex justify-between items-start">
        <div class="flex-grow">
          <h2 class="text-2xl font-bold mb-2">Awesome project on AI</h2>
          <p class="text-gray-600 mb-4">
            Dela stands for DEDIS Ledger Architecture. It is both a set of abstractions and an implementation of a distributed ledger architecture.

            Dela has 2 main purposes:

            Provide a modular, global-purpose, and universal framework that describes a minimal and extended set of abstractions for a distributed ledger architecture.
            Provide multiple modules implementations that can be combined to run a distributed ledger.
          </p>
        </div>
        <img src="~/assets/img/dedis.png" alt="DEDIS" class="w-40 rounded-full border-gray-800">
      </div>
      <div class="flex space-x-2"> <!-- This is the tag section -->
        <span class="text-right">
          <font-awesome :icon="['fa', 'tags']" class="fa-1x text-gray-500" />
        </span>
        <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">AI Alignment</span>
        <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">Cloud</span>
        <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">LLM</span>
      </div>


      <div class="flex space-x-4 justify-end">
        <a href="https://www.epfl.ch/labs/dedis/wp-content/uploads/2022/02/report-2021-3-baum-auguste-Dvoting.pdf" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome :icon="['fa', 'newspaper']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
        <a href="https://link.springer.com/chapter/10.1007/978-3-031-48806-1_31" class="text-gray-500 hover:underline flex items-center">  
          <div class="text-right">
            <!-- Research Paper -->
            <font-awesome :icon="['far', 'file']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
        <a href="https://dedis.github.io/dela" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome :icon="['fa', 'home']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
        <a href="https://github.com/dedis/dela" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome :icon="['fab', 'github']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
        <a href="mailto:pierluca.borso@epfl.ch" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome :icon="['fas', 'envelope']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);
</script>
