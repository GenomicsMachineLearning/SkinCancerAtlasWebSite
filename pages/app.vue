<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section>
        <iframe :src="source"></iframe>
      </nx-section>
    </nx-container>
  </div>
</template>

<script>
export default {
  methods: {},
  layout(context) {
    return context.store.state.layout;
  },
  data: () => ({
    source: "https://skincancer.shinyapps.io/scc_app/",
  }),
};
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
iframe {
  height: 350vh;
  width: 100%;
  border: none;
  box-sizing: border-box;
}
</style>
