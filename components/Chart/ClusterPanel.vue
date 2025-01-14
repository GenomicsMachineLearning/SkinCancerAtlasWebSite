<template>
  <div>
    <div ref="testLine" class="chart"></div>
    <!-- Button trigger modal -->
  </div>
</template>

<script>
import "echarts";
import { init, use, registerMap } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import { TitleComponent, VisualMapComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
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
      myChart: null,
      showModal: false,
      option: {
        tooltip: {},
        responsive: true,
        maintainAspectRatio: false,
        series: [],
        geo: {
          map: "ClusterPanel",
          selectedMode: "multiple",
          layoutCenter: ["50%", "50%"],
          layoutSize: "100%",
          itemStyle: {
            borderColor: null,
          },
          emphasis: {
            focus: "self",
            itemStyle: {
              color: null,
              borderColor: "#fff",
              textBorderColor: "#fff",
              textBorderWidth: 0,
            },
            label: {
              position: "bottom",
              distance: 0,
              textBorderColor: null,
              borderColor: null,
              textBorderWidth: 0,
              show: false,
            },
          },
          blur: {},

          select: {
            itemStyle: {
              color: null,
              borderColor: "black",
              textBorderColor: "#fff",
              textBorderWidth: 0,
            },
            label: {
              show: false,
            },
          },
        },
      },
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    initChart() {
      const { myChart, option, toggleModal } = this;
      registerMap("ClusterPanel", {
        svg: ClusterPanel,
      });

      myChart.setOption(option);

      myChart.on("hover", function (params) {
        // Print name in console
        return `<img src="https://findicons.com/files/icons/2166/oxygen/48/arrow_up.png">`;
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


<style scoped >
.chart {
  height: 80vh;
  /* width: 140vh; */
}
</style>

<style >
body {
  margin: 0;
}
</style>