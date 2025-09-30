<template>
  <div class="dynamic-panel">
    <!-- Display cell type images for each sample -->
    <div v-if="samples && samples.length > 0" class="samples-container">
      <div
        v-for="sample in samples"
        :key="`${sample.id}-${sample.platform}`"
        class="sample-item"
      >
        <div class="sample-header">
          <h4>{{ sample.id }} - {{ sample.platform.toUpperCase() }}</h4>
        </div>

        <!-- Cell Type Image -->
        <div class="image-container">
          <img
            :src="sample.links.cell_type"
            :alt="`Cell types for ${sample.id}`"
            class="cell-type-image"
            @error="handleImageError"
          />
        </div>

        <!-- Sample Links -->
        <div class="sample-links">
          <a
            :href="sample.links.cell_type"
            target="_blank"
            rel="noopener"
            class="sample-link"
          >
            View Cell Types
          </a>
          <a
            :href="sample.links.h_and_e"
            target="_blank"
            rel="noopener"
            class="sample-link"
          >
            View H&E
          </a>
          <a
            :href="sample.links.gene_expression"
            target="_blank"
            rel="noopener"
            class="sample-link"
          >
            View Gene Expression
          </a>
        </div>
      </div>
    </div>

    <!-- No samples message -->
    <div v-else class="no-samples">
      <p>No samples available for this condition.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicPanel",
  props: {
    condition: {
      type: String,
      required: true
    },
    samples: {
      type: Array,
      required: true
    },
    apiBaseUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    handleImageError(event) {
      // Handle image loading errors
      console.error('Failed to load image:', event.target.src);
      event.target.alt = 'Image failed to load';
      event.target.style.display = 'none';
    }
  }
};
</script>

<style scoped>
.dynamic-panel {
  width: 100%;
}

.samples-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.sample-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sample-header {
  background: #f7fafc;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.sample-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.image-container {
  padding: 1rem;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.cell-type-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.sample-links {
  padding: 1rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sample-link {
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #667eea;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.sample-link:hover {
  background: #667eea;
  color: white;
}

.no-samples {
  padding: 3rem;
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .samples-container {
    grid-template-columns: 1fr;
  }
}
</style>