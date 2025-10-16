<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section>
        <nx-section-header>
          <template slot="title">
            Skin Cancer Multi-omics Data
          </template>
          <template slot="subtitle">
            Interactive browser for ligand-receptor interaction from spatial transcriptomics gene expression data.
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
                    <button @click="fetchSamples" class="retry-btn">Retry</button>
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

                    <!-- Dropdown 2: Platform -->
                    <div class="control-group">
                      <label for="platform-select">Platform:</label>
                      <select id="platform-select" v-model="selectedPlatform" class="dropdown"
                              :disabled="!selectedCondition">
                        <option v-if="selectedCondition" value="">-- Choose --</option>
                        <option
                            v-for="platform in availablePlatforms"
                            :key="platform"
                            :value="platform"
                        >
                          {{ formatPlatformName(platform) }}
                        </option>
                      </select>
                    </div>

                    <!-- Dropdown 3: Sample -->
                    <div class="control-group">
                      <label for="sample-select">Sample:</label>
                      <select id="sample-select" v-model="selectedSample" class="dropdown"
                              :disabled="!selectedPlatform">
                        <option v-if="selectedPlatform" value="">-- Choose --</option>
                        <option
                            v-for="sample in availableSamples"
                            :key="sample"
                            :value="sample"
                        >
                          {{ sample }}
                        </option>
                      </select>
                    </div>

                    <!-- Dropdown 4: LR -->
                    <div class="control-group">
                      <label for="gene-select">Ligand-Receptor:</label>
                      <select id="lr-select" v-model="selectedLr" class="dropdown"
                              :disabled="!selectedSample || availableLrs.length === 0">
                        <option value="">{{
                            lrsLoading ? 'Loading...' :
                                !selectedSample || availableLrs.length === 0 ? '' : '-- Choose --' }}
                        </option>
                        <option
                            v-for="lr in availableLrs"
                            :key="lr"
                            :value="lr"
                        >
                          {{ lr }}
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
                  <div v-if="!currentSample" class="placeholder">
                    <div class="placeholder-icon">📊</div>
                    <h3>Select Sample to View</h3>
                    <p>Choose a condition, platform, sample and LR from the left panel</p>
                  </div>

                  <!-- Show split view when sample is selected -->
                  <div v-else class="split-view">
                    <!-- Cell Type -->
                    <div class="view-half">
                      <div class="image-header">
                        <h3>Cell Types</h3>
                        <span v-if="selectedCondition" class="lr-badge">{{ selectedCondition }}</span>
                        <span v-if="selectedPlatform" class="lr-badge">{{ selectedPlatform }}</span>
                        <span v-if="selectedSample" class="lr-badge">{{ selectedSample }}</span>
                      </div>

                      <div class="image-wrapper">
                        <!-- Loading spinner -->
                        <div v-if="cellTypeImageLoading" class="image-loading">
                          <div class="spinner"></div>
                          <p>Loading cell types...</p>
                        </div>

                        <!-- Image -->
                        <img
                            v-if="selectedSample && cellTypeUrl"
                            v-show="!cellTypeImageLoading"
                            :src="cellTypeUrl"
                            :alt="`Cell Typing for ${selectedSample}`"
                            class="cell-type-image"
                            @load="handleCellTypeImageLoad"
                            @error="handleImageError"
                        />

                        <!-- Empty state -->

                        <div v-if="!selectedSample" class="empty-placeholder">
                          <p>Select a LR to view expression</p>
                        </div>
                      </div>
                    </div>
                    <!-- LR -->
                    <div class="view-half">
                      <div class="image-header">
                        <h3>Ligand-Receptor</h3>
                        <span v-if="selectedLr" class="lr-badge">{{ selectedLr }}</span>
                      </div>
                      <div class="image-wrapper">
                        <!-- Loading spinner -->
                        <div v-if="lrImageLoading" class="image-loading">
                          <div class="spinner"></div>
                          <p>Loading gene expression...</p>
                        </div>

                        <!-- Image -->
                        <img
                            v-if="selectedLr && lrImageUrl"
                            v-show="!lrImageLoading"
                            :src="lrImageUrl"
                            :alt="`Gene expression for ${selectedLr}`"
                            class="cell-type-image"
                            @load="handleLrImageLoad"
                            @error="handleLrImageError"
                        />

                        <!-- Empty state -->
                        <div v-if="!selectedLr" class="empty-placeholder">
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
    selectedPlatform: '',
    selectedSample: '',
    samples: [],
    selectedLr: '',
    availableLrs: [],
    lrImageLoading: false,
    cellTypeImageLoading: false,
    loading: false,
    lrsLoading: false,
    error: null,
    apiBaseUrl: ''
  }),
  computed: {
    availableConditions() {
      const uniqueConditions = [...new Set(this.samples.map(s => s.condition))];
      const order = ['melanoma', 'bcc', 'scc'];
      return uniqueConditions.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });
    },
    availablePlatforms() {
      const availablePlatforms = [...new Set(this.samples.filter(s =>
          s.condition === this.selectedCondition &&
          s.links.lrs != null
      ).map(s => s.platform))];
      const order = ['visium', 'xenium', 'cosmx'];
      return availablePlatforms.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });
    },
    availableSamples() {
      const selectedSample = [...new Set(this.samples.filter(s =>
          s.condition === this.selectedCondition &&
          s.platform === this.selectedPlatform &&
          s.links.lrs != null
      ).map(s => s.id))];
      return selectedSample.sort()
    },
    currentSample() {
      if (!this.selectedCondition || !this.selectedPlatform || !this.selectedSample) {
        return null;
      }
      return this.samples.find(
          s => s.condition === this.selectedCondition &&
              s.platform === this.selectedPlatform &&
              s.id === this.selectedSample &&
              s.links.lrs != null
      );
    },
    cellTypeUrl() {
      if (!this.currentSample) return '';

      const baseUrl = this.currentSample.links.cell_type;
      const params = this.currentSample.render_params;

      if (!params) return baseUrl;

      // Convert render_params object to query string
      const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

      return `${baseUrl}?${queryString}`;
    },
    lrsListUrl() {
      if (!this.currentSample) return '';
      return this.currentSample.links.lrs;
    },
    lrImageUrl() {
      if (!this.currentSample || !this.selectedLr) return '';

      const baseUrl = `${this.currentSample.links.lrs}/${this.selectedLr}`;
      const params = this.currentSample.render_params;

      if (!params) return baseUrl;

      const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

      return `${baseUrl}?${queryString}`;
    },
  },
  mounted() {
    this.setApiBaseUrl();
    this.fetchSamples();
  },
  watch: {
    selectedCondition(newVal) {
      this.selectedCondition = newVal;
      this.selectedPlatform = '';
      this.selectedSample = '';
      this.selectedLr = '';
    },
    selectedPlatform(newVal) {
      this.selectedPlatform = newVal;
      this.selectedSample = '';
      this.selectedLr = '';
    },
    selectedSample(newVal) {
      this.selectedSample = newVal;
      if (newVal) {
        this.availableLrs = [];
        this.selectedLr = '';
        this.cellTypeImageLoading = true;
        this.fetchLRs();
      }
    },
    selectedLr(newVal) {
      if (newVal) {
        this.lrImageLoading = true;
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
    async fetchSamples() {
      try {
        this.loading = true;
        this.error = null;
        const response = await fetch(`${this.apiBaseUrl}/samples`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.samples = await response.json();
      } catch (err) {
        this.error = `Failed to load samples: ${err.message}`;
        console.error('Error fetching samples:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchLRs() {
      if (!this.currentSample) return;

      this.lrsLoading = true;

      try {
        const response = await fetch(this.lrsListUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        this.availableLrs = await response.json();
      } catch (err) {
        console.error('Error fetching lrs:', err);
        this.availableLrs = [];
      } finally {
        this.lrsLoading = false;
      }
    },
    handleCellTypeImageLoad() {
      this.cellTypeImageLoading = false;
    },
    handleLrImageLoad() {
      this.lrImageLoading = false;
    },
    handleLrImageError(event) {
      this.lrImageLoading = false;
      console.error('Failed to load lr image:', event.target.src);
      event.target.alt = 'Image failed to load';
    },
    formatConditionName(condition) {
      const names = {
        'melanoma': 'Melanoma',
        'scc': 'SCC',
        'bcc': 'BCC'
      };
      return names[condition] || condition.toUpperCase();
    },
    formatPlatformName(platform) {
      const names = {
        'visium': 'Visium',
        'xenium': 'Xenium',
        'cosmx': 'CosMX'
      };
      return names[platform] || platform.toUpperCase();
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