<template>
  <div class="main-content">
    <nx-container horizontal="default">
      <nx-section>
        <nx-section-header>
          <template slot="title">
            Skin Cancer Multi-omics Data
          </template>
          <template slot="subtitle">
            Interactive browser for spatial transcriptomics and single-cell data
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
                      <label for="condition-select">Select Condition:</label>
                      <select id="condition-select" v-model="selectedCondition" class="dropdown">
                        <option value="">-- Choose Condition --</option>
                        <option
                            v-for="condition in available_conditions"
                            :key="condition"
                            :value="condition"
                        >
                          {{ formatConditionName(condition) }}
                        </option>
                      </select>
                    </div>

                    <!-- Dropdown 2: Platform -->
                    <div class="control-group">
                      <label for="platform-select">Select Platform:</label>
                      <select id="platform-select" v-model="selectedPlatform" class="dropdown">
                        <option value="">-- Choose Platform --</option>
                        <option
                            v-for="platform in available_platforms"
                            :key="platform"
                            :value="platform"
                        >
                          {{ formatPlatformName(platform) }}
                        </option>
                      </select>
                    </div>

                    <!-- Dropdown 3: Sample -->
                    <div class="control-group">
                      <label for="sample-select">Select Sample:</label>
                      <select id="sample-select" v-model="selectedSample" class="dropdown">
                        <option value="">-- Choose Sample --</option>
                        <option
                            v-for="sample in available_samples"
                            :key="sample"
                            :value="sample"
                        >
                          {{ sample }}
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
              <template slot="header">
                <nx-card-header>
                  <template slot="title">Visualization</template>
                </nx-card-header>
              </template>
              <template slot="body">
                <div class="content-container">
                  <div v-if="!currentSample" class="placeholder">
                    <div class="placeholder-icon">📊</div>
                    <h3>Select Sample to View</h3>
                    <p>Choose a condition, platform, and sample from the left panel</p>
                  </div>

                  <!-- Show image when sample is selected -->
                  <div v-else class="image-display">
                    <div class="image-header">
                      <h3>{{ selectedSample }} - {{ formatConditionName(selectedCondition) }}</h3>
                      <span class="platform-badge">{{ formatPlatformName(selectedPlatform) }}</span>
                    </div>

                    <div class="image-wrapper">
                      <img
                          :src="cellTypeUrl"
                          :alt="`Cell types for ${selectedSample}`"
                          class="cell-type-image"
                          @error="handleImageError"
                      />
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
    loading: false,
    error: null,
    apiBaseUrl: ''
  }),
  computed: {
    available_conditions() {
      const uniqueConditions = [...new Set(this.samples.map(s => s.condition))];
      const order = ['melanoma', 'bcc', 'scc'];
      return uniqueConditions.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });
    },
    available_platforms() {
      const availablePlatforms = [...new Set(this.samples.filter(s => s.condition === this.selectedCondition).map(s => s.platform))];
      const order = ['visium', 'xenium', 'cosmx'];
      return availablePlatforms.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b);
      });
    },
    available_samples() {
      const selectedSample = [...new Set(this.samples.filter(s =>
          s.condition === this.selectedCondition && s.platform === this.selectedPlatform).map(s => s.id))];
      return selectedSample.sort()
    },
    currentSample() {
      if (!this.selectedCondition || !this.selectedPlatform || !this.selectedSample) {
        return null;
      }
      return this.samples.find(
          s => s.condition === this.selectedCondition &&
              s.platform === this.selectedPlatform &&
              s.id === this.selectedSample
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
    }
  },
  mounted() {
    this.setApiBaseUrl();
    this.fetchSamples();
  },
  watch: {
    selectedCondition(newVal) {
      this.selectedCondition = newVal;
      console.log('Condition changed to:', newVal);
    },
    selectedPlatform(newVal) {
      this.selectedPlatform = newVal;
      console.log('Platform changed to:', newVal);
    },
    selectedSample(newVal) {
      this.selectedSample = newVal;
      console.log('Sample changed to:', newVal);
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
        console.log('Fetched samples:', this.samples);
        console.log('Available conditions:', this.available_conditions);
      } catch (err) {
        this.error = `Failed to load samples: ${err.message}`;
        console.error('Error fetching samples:', err);
      } finally {
        this.loading = false;
      }
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

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown:hover {
  border-color: #cbd5e0;
}

.dropdown:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Debug Info */
.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.debug-info h4 {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.debug-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #718096;
}

.debug-info strong {
  color: #2d3748;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 2rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #718096;
  font-size: 0.875rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem 1rem;
}

.error-state p {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #5568d3;
}

/* Content Area */
.content-container {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  color: #718096;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.placeholder h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.placeholder p {
  font-size: 1rem;
  color: #718096;
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