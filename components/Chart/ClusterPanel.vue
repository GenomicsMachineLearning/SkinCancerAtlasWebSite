<template>
  <div>
    <div ref="testLine" class="chart"></div>
    <!-- Button trigger modal -->
  </div>
</template>

<script>
import "echarts";
import {init, use, registerMap} from "echarts/core";
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
              opacity: 0.8,
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
      const textElements = svgDoc.querySelectorAll('g > text');

      textElements.forEach(text => {
        // Get text position and dimensions
        const x = parseFloat(text.getAttribute('x') || 0);
        const y = parseFloat(text.getAttribute('y') || 0);
        const textLength = parseFloat(text.getAttribute('textLength') || 0);

        // Create a transparent rectangle for better hit detection
        // Adding padding around the text (10px on each side)
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', Math.max(0, x - 10));
        rect.setAttribute('y', Math.max(0, y - 20)); // Position above text for better hover
        rect.setAttribute('width', textLength + 20); // Add padding
        rect.setAttribute('height', 24);  // Typical text height plus padding
        rect.setAttribute('fill', 'transparent');
        rect.setAttribute('pointer-events', 'all'); // Ensure it captures events

        // Add the rectangle before the text in the same group
        // This ensures the text appears on top
        const parentGroup = text.parentNode;
        parentGroup.insertBefore(rect, text);
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
  },
};
</script>


<style scoped>
.chart {
  height: 80vh;
  /* width: 140vh; */
}
</style>

<style>
body {
  margin: 0;
}
</style>