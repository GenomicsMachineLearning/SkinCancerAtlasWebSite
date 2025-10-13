<template>
  <div
    id="layout-horizontal"
    class="layout-wrapper bg-light dark:bg-dark min-h-screen"
  >
    <div id="app">
      <nx-header />
    </div>
    <div id="content">
      <transition name="fade-slide-horizontal" mode="out-in">
        <Nuxt />
      </transition>
      <footer
        class="footer bg-white relative pt-1 border-b-2"
        style="color: #fb6f92"
      >
        <div class="container mx-auto px-6">
          <div class="flex row place-content-center">
            <div class="flex col">
              <img
                src="@/assets/images/QIMR-Berghofer-Logo-New.png"
                class="object-scale-down w-96"
                alt="QIMR Logo"
              />
            </div>
            <div class="flex col">
              <img
                src="@/assets/images/imb_logo.png"
                class="object-scale-down w-96"
                alt="IMB_logo"
              />
            </div>
          </div>
          <div
            class="mt-16 border-t-2 border-gray-300 flex flex-col items-center"
          >
            <div class="sm:w-2/3 text-center py-6">
              <p class="text-sm font-bold mb-2" style="color: #fb6f92">
                Copyright © 2022-2025 Nguyen Lab
              </p>
              <p class="text-sm font-bold mb-2" style="color: #fb6f92">
                This project was led by the Nguyen <a target="_blank" style="color: #1e90ff;" href="https://www.qimrberghofer.edu.au/our-research/infection-and-inflammation/genomics-and-machine-learning-lab-2/">Genomics and Machine Learning Lab</a> at the
                <a target="_blank" style="color: #1e90ff;" href="https://www.qimrberghofer.edu.au/">QIMR Berghofer Medical Research Institute</a>, Queensland, Australia
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>