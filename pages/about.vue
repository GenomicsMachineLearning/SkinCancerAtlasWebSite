<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section-header>
        <template slot="title">
          The Study
        </template>
      </nx-section-header>
      <div class="flex row">
        <div class="w-full col">
          <div class="flex row">
            <div class="w-full col">
              <nx-card>
                <template slot="body">
                  <div class="p-4">
                    The three major skin cancer types – squamous cell carcinoma (SCC), 
                    basal cell carcinoma (BCC), and melanoma – account for over 70% 
                    of all cancer cases. Although all three skin cancer types develop 
                    in the same skin layer, the epidermis, they vary considerably in 
                    their initiation, metastasis potential and disease outcomes. To better 
                    understand the cellular differences between SCC, BCC, and melanoma, and 
                    how these differences patient outcomes, we built a single-cell and spatial 
                    multi-omics atlas and interactome of skin cancer. 
                    <br>
                    <br>
                    Visualise gene expression and ligand-receptor interactions in SCC, BCC and melanoma. Data was
                    generated using single-cell RNA sequencing (scRNASeq), Visium spatial transcriptomics and
                    CosMx spatial transcriptomics.
                  </div>
                  <img src="@/assets/images/panels/Methods.png" alt="methods" class="mx-auto">

                  <div class="p-4 flex items-center justify-center">
                    <p><b>Figure 1:</b> Overview of sample design and technologies used to generate the data available. </p>
                  </div>

                  <div>
                    This project was led by the Nguyen <a target="_blank" style="color: #1e90ff;" 
                    href="https://www.qimrberghofer.edu.au/our-research/infection-and-inflammation/genomics-and-machine-learning-lab-2/">Genomics and Machine Learning Lab</a> team at the
                    <a target="_blank" style="color: #1e90ff;" 
                    href="https://www.qimrberghofer.edu.au/">QIMR Berghofer Medical Research Institute</a>, Queensland, Australia.
                    For further information, please contact Quan Nguyen at quan.nguyen@qimrberghofer.edu.au
                  </div>
                </template>
              </nx-card>
            </div>
          </div>
        </div>
      </div>
    </nx-container>
    <nx-container horizontal="default">
      <nx-section-header>
        <template slot="title">
          Skin Cancer Atlas
        </template>
      </nx-section-header>
      <div class="flex row">
        <div class="w-full col">
          <div class="flex row">
            <div class="w-full col">
          
              <nx-card>
                <template slot="body">
                  <div class="p-4">
                    Welcome to the Skin Cancer Atlas. Here you can browse gene expression
                     and ligand-receptor interactions at single-cell and spatial resolution for
                      SCC, BCC and melanoma.
                  </div>

                  <router-link to="/"><nx-badge color="primary" >Atlas</nx-badge></router-link>

                  <div class="p-4">
                    This tab shows cell type clustering and annotation results from scRNASeq, 
                    Visium and CosMx data. Hover over or click on each image for further detail.
                  </div>

                  <router-link to="/app"><nx-badge color="primary">Gene Explorer</nx-badge></router-link>

                  <div class="p-4">
                    Here you can browse to see your favourite gene or ligand-receptor pair at 
                    single-cell and/or spatial resolution in select samples from SCC, BCC and melanoma patients.
                  </div>
                </template>
              </nx-card>
            </div>
          </div>
        </div>
      </div>
    </nx-container>
    <nx-container horizontal="default">
      <nx-section-header>
        <template slot="title">
          Data and code availability
        </template>
      </nx-section-header>
      <div class="flex row">
        <div class="w-full col">
          <div class="flex row">
            <div class="w-full col">
              <nx-card>
                <template slot="body">
                  <div class="p-4">
                    Data and software will be made available after publication.
                  </div>
                </template>
              </nx-card>
            </div>
          </div>
        </div>
      </div>
    </nx-container>
  </div>
</template>
<script>
export default {
  components: {},

  methods: {},
  layout(context) {
    return context.store.state.layout;
  },
  data() {
    return {};
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
