<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section>
        <nx-section-header>
          <template slot="title">
            Skin Cancer Atlas: A spatial single-cell multi-omics atlas and interactome for skin cancer
          </template>
          <template slot="subtitle">
            Welcome to the interactive browser of cell types and molecular markers for SCC, BCC and melanoma
          </template>
        </nx-section-header>
        <div class="flex row">
          <div class="w-full col">
            <div class="flex row">
              <div class="w-full col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">scRNAseq - UMAP</template>
                      <template slot="subtitle">Hover over cell types to see the clusters OR over the clusters to see
                        cell types
                      </template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <ClusterPanel></ClusterPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
            </div>
          </div>
        </div>
      </nx-section>
    </nx-container>
  </div>
</template>

<script>
import ClusterPanel from "~/components/Chart/ClusterPanel";

export default {
  name: "IndexPage",
  components: {
    ClusterPanel
  },
  layout(context) {
    return context.store.state.layout;
  },
  data: () => ({})
};
</script>

<style scoped>
</style>