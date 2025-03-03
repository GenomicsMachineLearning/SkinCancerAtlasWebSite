<template>
  <div>
    <div ref="testLine" class="chart"></div>
    <!-- Button trigger modal -->
  </div>
</template>

<script>
import "echarts";
import {init, registerMap, use} from "echarts/core";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";
import {MapChart} from "echarts/charts";
import {TitleComponent, VisualMapComponent} from "echarts/components";
import VChart, {THEME_KEY} from "vue-echarts";
import ClusterPanel from "@/assets/images/panels/ClusterPanel.svg?raw";

use([
  CanvasRenderer,
  SVGRenderer,
  MapChart,
  VisualMapComponent,
  TitleComponent,
]);

export default {
  name: "HelloWorld",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // Extract group name when hovering
            return params.name || 'Unnamed Group';
          }
        },
        series: [{
          type: 'map',
          map: 'ClusterPanel',
          roam: false,
          itemStyle: {
            areaColor: null, // Keep original colors
            borderColor: null, // Keep original borders
            borderWidth: 0 // Don't add extra borders
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              // Don't replace colors, just add opacity for hover effect
              areaColor: null,
              opacity: 1.0,
              borderColor: null,
              borderWidth: 0
            },
            label: {
              show: false
            }
          },
          // Blur state - apply blue tint to non-hovered elements
          blur: {
            itemStyle: {
              // This creates a blue overlay on unselected items
              // Adjust the color and opacity to control the intensity of blue
              opacity: 0.01
            }
          },
          selectedMode: false
        }]
      }
    };
  },
  methods: {
    // Function to enhance SVG by adding hitbox rectangles for text elements
    addHitboxesToSVG(svgString) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

      // Find all text elements within groups
      const textElements = svgDoc.querySelectorAll('g text');

      textElements.forEach(text => {
        // Get text position (default to 0 if not specified)
        let x = parseFloat(text.getAttribute('x') || 0);
        let y = parseFloat(text.getAttribute('y') || 0);
        const textLength = parseFloat(text.getAttribute('textLength') || 0);
        let transformGroup = null;

        // Accumulate transformations from all parent groups
        for (let parent = text.parentElement; parent; parent = parent.parentElement) {
          if (parent.tagName === 'g' && parent.getAttribute('transform')) {
            const transform = parent.getAttribute('transform');

            // Parse matrix transform
            if (transform.startsWith('matrix')) {
              const matrixValues = transform.match(/matrix\((.*?)\)/)[1].split(',').map(parseFloat);

              // Apply the translation from the matrix
              x += matrixValues[4];
              y += matrixValues[5];

              // Store the last transformed parent
              transformGroup = parent;
            }
          }
        }

        // Create a transparent rectangle for better hit detection
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const fontSize = parseInt(window.getComputedStyle(text).fontSize) || 12;
        rect.setAttribute('x', Math.max(0, x - 10));
        rect.setAttribute('y', Math.max(0, y - fontSize - 5)); // Position above text baseline
        rect.setAttribute('width', (textLength || text.getComputedTextLength() || text.textContent.length * 7) + 20);
        rect.setAttribute('height', fontSize + 10);
        rect.setAttribute('fill', 'transparent');
        rect.setAttribute('stroke', 'rgba(0,0,0,0.9)'); // Slightly visible for debugging
        rect.setAttribute('pointer-events', 'all');

        // Add the rectangle at the same level as the top-most transform group
        if (transformGroup && transformGroup.parentNode) {
          transformGroup.parentNode.insertBefore(rect, transformGroup);
        } else {
          // Fallback to the original approach
          const parentGroup = text.parentNode;
          parentGroup.insertBefore(rect, text);
        }
      });

      // Convert back to string
      return new XMLSerializer().serializeToString(svgDoc);
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    initChart() {
      const {myChart, option, toggleModal} = this;
      const enhancedSVG = this.addHitboxesToSVG(ClusterPanel);
      registerMap("ClusterPanel", {
        svg: enhancedSVG,
        useOriginalStyle: true
      });

      myChart.setOption(option);

      // Use proper ECharts events
      this.myChart.on("mouseover", (params) => {
        // Check if we're hovering over a hitbox with a group ID
        if (params.targetEl && params.targetEl.getAttribute('data-group-id')) {
          const groupId = params.targetEl.getAttribute('data-group-id');
          // Highlight only this specific element
          this.myChart.dispatchAction({
            type: 'highlight',
            name: groupId
          });
        }
      });

      this.myChart.on("mouseout", (params) => {
        if (params.targetEl && params.targetEl.getAttribute('data-group-id')) {
          // Reset the highlighting
          this.myChart.dispatchAction({
            type: 'downplay'
          });
        }
      });
    },
  },
  mounted() {
    //Both import methods are OK. I use ref here. Note that node initialization must be completed
    // this.myChart = this.$echarts.init(document.getElementById('testLine'))

    this.myChart = init(this.$refs.testLine);

    this.initChart();

    // Add resize listener
    window.addEventListener('resize', () => {
    this.myChart.resize();
  });
  },
};
</script>


<style scoped>
.chart {
  height: 80vh;
  width: 100%;
  background-color: white;
}
</style>

<style>
body {
  margin: 0;
}
</style>