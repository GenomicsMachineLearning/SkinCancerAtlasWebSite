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

        <div class="mb-5">
          <nx-badge color="primary">scRNAseq</nx-badge>
          <p>
            We performed clustering of cells from healthy and SCC samples and identified eleven broad cell type clusters.
          </p>
        </div>

        <div class="flex row">
          <div class="w-full col">
            <div class="flex row">
              <div class="w-full col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">scRNAseq - UMAP</template>
                      <template slot="subtitle"
                        >Hover to see the clusters</template
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

        <div class="mb-5">
          <nx-badge color="primary">Visium spatial transcriptomics</nx-badge>
          <p>
            We annotated Visium spots using clustering and cell type deconvolution. Cluster annotations are shown. Hover over the clusters to see UMAP plots and how the clusters correspond to cell types. 
          </p>
        </div>

        <div class="flex row">
          <div class="w-full col">
            <div class="flex row">
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">SCC - Visium</template>
                      <template slot="subtitle"
                        >Hover to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <SccPanel></SccPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">BCC - Visium</template>
                      <template slot="subtitle"
                        >Hover to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <BccPanel></BccPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">Melanoma - Visium</template>
                      <template slot="subtitle"
                        >Hover to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <MelanomaPanel></MelanomaPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <nx-badge color="primary">CosMx spatial transcriptomics</nx-badge>
          <p>
            We annotated individual cells using our scRNASeq atlas. Click on each UMAP plot to see a representative H&E image, immunofluorescent data and spatial cell type data. 
          </p>
        </div>

        <div class="flex row">
          <div class="w-full col">
            <div class="flex row">
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">SCC - CosMx</template>
                      <template slot="subtitle"
                        >Click to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <SMISccPanel></SMISccPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">BCC - CosMx</template>
                      <template slot="subtitle"
                        >Click to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <SMIBccPanel></SMIBccPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
              <div class="w-full md:w-1/3 col">
                <nx-card>
                  <template slot="header">
                    <nx-card-header>
                      <template slot="title">Melanoma - CosMx</template>
                      <template slot="subtitle"
                        >Click to see the metadata</template
                      >
                    </nx-card-header>
                  </template>
                  <template slot="body">
                    <client-only>
                      <SMIMelanomaPanel></SMIMelanomaPanel>
                    </client-only>
                  </template>
                </nx-card>
              </div>
            </div>
          </div>
        </div>

        <div class="flex row">
          <div class="w-full col">
            <div class="flex row">
              <div class="w-full col">
                <nx-card>
                  <template slot="body">
                    <div class="pt-10 flex items-center justify-center">
                      <img
                        class="w-1/2 justify-center content-center"
                        src="@/assets/images/panels/SMI_annotation.png"
                        alt="blue"
                      />
                    </div>
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
import SccPanel from "~/components/Chart/SccPanel";
import BccPanel from "~/components/Chart/BccPanel";
import MelanomaPanel from "~/components/Chart/MelanomaPanel";
import SMISccPanel from "~/components/Chart/SMISccPanel";
import SMIBccPanel from "~/components/Chart/SMIBccPanel";
import SMIMelanomaPanel from "~/components/Chart/SMIMelanomaPanel";

export default {
  methods: {},
  components: {
    ClusterPanel,
    SccPanel,
    BccPanel,
    MelanomaPanel,
    SMISccPanel,
    SMIBccPanel,
    SMIMelanomaPanel,
  },
  layout(context) {
    return context.store.state.layout;
  },
  data: () => ({}),
};
</script>

<style scoped>
</style>
