<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section>
        <nx-section-header>
          <template slot="title">
            Skin Cancer Gene Expression Data
          </template>
          <template slot="subtitle">
            Interactive browser for single cell gene expression data.
          </template>
        </nx-section-header>

        <div class="two-pane-layout">
          <!-- Left Pane - Controls -->
          <div class="left-pane">
            <nx-card>
              <template slot="header">
                <nx-card-header>
                  <template slot="title">Filters & Options</template>
                </nx-card-header>
              </template>
              <template slot="body">
                <div class="controls-container">
                  <!-- Loading State -->
                  <div v-if="loading" class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading samples...</p>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="error" class="error-state">
                    <p>{{ error }}</p>
                    <button @click="fetchScrnaseq" class="retry-btn">Retry</button>
                  </div>

                  <!-- Controls -->
                  <template v-else>
                    <!-- Dropdown 1: Condition -->
                    <div class="control-group">
                      <label for="condition-select">Skin Cancer Type:</label>
                      <select id="condition-select" v-model="selectedCondition" class="dropdown">
                        <option value="">-- Choose --</option>
                        <option
                            v-for="condition in availableConditions"
                            :key="condition"
                            :value="condition"
                        >
                          {{ formatConditionName(condition) }}
                        </option>
                      </select>
                    </div>

                    <!-- Dropdown 2: Gene -->
                    <div class="control-group">
                      <label for="gene-select">Gene:</label>
                      <select id="gene-select" v-model="selectedGene" class="dropdown"
                              :disabled="!selectedCondition || availableGenes.length === 0">
                        <option v-if="selectedCondition" value="">-- Choose --</option>
                        <option
                            v-for="gene in availableGenes"
                            :key="gene"
                            :value="gene"
                        >
                          {{ gene }}
                        </option>
                      </select>
                    </div>
                  </template>
                </div>
              </template>
            </nx-card>
          </div>

          <!-- Right Pane - Content -->
          <div class="right-pane">
            <nx-card>
              <template slot="body">
                <div class="content-container">
                  <div v-if="!currentCondition" class="placeholder">
                    <div class="placeholder-icon">📊</div>
                    <h3>Select Sample to View</h3>
                    <p>Choose a condition, platform, sample and gene from the left panel</p>
                  </div>

                  <!-- Show split view when sample is selected -->
                  <div v-else class="split-view">
                    <!-- Cell Type -->
                    <div class="view-half">
                      <div class="image-header">
                        <h3>Cell Types</h3>
                        <span v-if="selectedCondition" class="gene-badge">{{ selectedCondition }}</span>
                      </div>

                      <div class="image-wrapper">
                        <!-- Loading spinner -->
                        <div v-if="cellTypeImageLoading" class="image-loading">
                          <div class="spinner"></div>
                          <p>Loading cell types...</p>
                        </div>

                        <!-- Image -->
                        <img
                            v-if="cellTypeUrl"
                            v-show="!cellTypeImageLoading"
                            :src="cellTypeUrl"
                            :alt="`Cell Typing for ${selectedCondition}`"
                            class="cell-type-image"
                            @load="handleCellTypeImageLoad"
                            @error="handleImageError"
                        />

                        <!-- Empty state -->

                        <div v-if="!selectedCondition" class="empty-placeholder">
                          <p>Select a gene to view expression</p>
                        </div>
                      </div>
                    </div>
                    <!-- Gene Expression -->
                    <div class="view-half">
                      <div class="image-header">
                        <h3>Gene Expression</h3>
                        <span v-if="selectedGene" class="gene-badge">{{ selectedGene }}</span>
                      </div>
                      <div class="image-wrapper">
                        <!-- Loading spinner -->
                        <div v-if="geneImageLoading" class="image-loading">
                          <div class="spinner"></div>
                          <p>Loading gene expression...</p>
                        </div>

                        <!-- Image -->
                        <img
                            v-if="selectedGene && geneImageUrl"
                            v-show="!geneImageLoading"
                            :src="geneImageUrl"
                            :alt="`Gene expression for ${selectedGene}`"
                            class="cell-type-image"
                            @load="handleGeneImageLoad"
                            @error="handleGeneImageError"
                        />

                        <!-- Empty state -->
                        <div v-if="!selectedGene" class="empty-placeholder">
                          <p>Select a gene to view expression</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </nx-card>
          </div>
        </div>
      </nx-section>
    </nx-container>
  </div>
</template>

<script>
export default {
  name: "AppPage",
  layout(context) {
    return context.store.state.layout;
  },
  data: () => ({
    selectedCondition: '',
    scrnaseqs: [],
    selectedGene: '',
    availableGenes: [],
    geneImageLoading: false,
    cellTypeImageLoading: false,
    loading: false,
    error: null,
    apiBaseUrl: ''
  }),
  computed: {
    availableConditions() {
      const uniqueConditions = [...new Set(this.scrnaseqs.map(s => s.condition))];
      const order = ['melanoma', 'scc_bcc'];
      return uniqueConditions.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });
    },
    currentCondition() {
      if (!this.selectedCondition) {
        return null;
      }
      return this.scrnaseqs.find(
          s => s.id === this.selectedCondition
      );
    },
    cellTypeUrl() {
      if (!this.currentCondition) return '';

      const baseUrl = this.currentCondition.links.cell_type;
      const params = this.currentCondition.render_params;

      if (!params) return baseUrl;

      // Convert render_params object to query string
      const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

      return `${baseUrl}?${queryString}`;
    },
    genesListUrl() {
      if (!this.currentCondition) return '';
      return this.currentCondition.links.gene_expression;
    },
    geneImageUrl() {
      if (!this.currentCondition || !this.selectedGene) return '';

      const baseUrl = `${this.currentCondition.links.gene_expression}/${this.selectedGene}`;
      const params = this.currentCondition.render_params;

      if (!params) return baseUrl;

      const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

      return `${baseUrl}?${queryString}`;
    },
  },
  mounted() {
    this.setApiBaseUrl();
    this.fetchScrnaseq();
  },
  watch: {
    selectedCondition(newVal) {
      this.selectedCondition = newVal;
      this.selectedGene = '';
      if (newVal) {
        this.availableGenes = [];
        this.cellTypeImageLoading = true;
        this.fetchScrnaseqGenes();
      }
    },
    selectedGene(newVal) {
      if (newVal) {
        this.geneImageLoading = true;
      }
    }
  },
  methods: {
    setApiBaseUrl() {
      const isDevelopment = process.env.NODE_ENV === 'development';
      this.apiBaseUrl = isDevelopment
          ? 'http://localhost:8000'
          : 'https://skincanceratlas.com';
    },
    async fetchScrnaseq() {
      try {
        this.loading = true;
        this.error = null;
        const response = await fetch(`${this.apiBaseUrl}/scrnaseq`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.scrnaseqs = await response.json();
      } catch (err) {
        this.error = `Failed to load samples: ${err.message}`;
        console.error('Error fetching samples:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchScrnaseqGenes() {
      if (!this.currentCondition) return;

      try {
        const response = await fetch(this.genesListUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        this.availableGenes = await response.json();
      } catch (err) {
        console.error('Error fetching genes:', err);
        this.availableGenes = [];
      }
    },
    handleCellTypeImageLoad() {
      this.cellTypeImageLoading = false;
    },
    handleGeneImageLoad() {
      this.geneImageLoading = false;
    },
    handleGeneImageError(event) {
      this.geneImageLoading = false;
      console.error('Failed to load gene image:', event.target.src);
      event.target.alt = 'Image failed to load';
    },
    formatConditionName(condition) {
      const names = {
        'melanoma': 'Melanoma',
        'scc_bcc': 'SCC/BCC',
      };
      return names[condition] || condition.toUpperCase();
    },
    handleImageError(event) {
      console.error('Failed to load image:', event.target.src);
      event.target.alt = 'Image failed to load';
    }
  }
};
</script>

<style scoped>
.two-pane-layout {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Left Pane - Controls */
.left-pane {
  flex: 0 0 320px;
  min-width: 320px;
}

/* Right Pane - Content */
.right-pane {
  flex: 1;
  min-width: 0;
}

/* Controls Styling */
.controls-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Responsive Design */
@media (max-width: 968px) {
  .two-pane-layout {
    flex-direction: column;
  }

  .left-pane {
    flex: 1;
    min-width: 100%;
  }
}
</style>