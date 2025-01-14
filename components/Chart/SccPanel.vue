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
import SccPanel from "@/assets/images/panels/SccPanel.svg?raw";

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
        tooltip: {
          show: true,
          trigger: "item",
          formatter: function (params) {
            return `<img src="@/assets/images/panels/spatial_metadata/scc/cluster_0.png">`;
          },
        },
        series: [],
        geo: {
          tooltip: {
            show: true,
            trigger: "item",
            formatter: function (params) {
              const myArray = params.name.split(" ");
              let cluster = myArray[1];
              const img_url = require(`@/assets/images/panels/spatial_metadata/scc/cluster_${cluster}.png`);
              return `<img src="${img_url}">`;
            },
            position: function (point, params, dom, rect, size) {
              //Where point is the current mouse position, and there are two attributes in size: viewSize and contentSize, which are the size of the outer div and tooltip prompt box respectively
              var x = point[0]; //
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0; //x coordinate position
              var posY = 0; //y coordinate position

              if (x < boxWidth) {
                //The left side cannot be released
                posX = 5;
              } else {
                //Left down
                posX = x - boxWidth;
              }

              if (y < boxHeight) {
                //Can't let go of the top
                posY = 5;
              } else {
                //The upper side can be put down
                posY = y - boxHeight;
              }

              return [posX, posY];
            },
          },
          map: "SccPanel",
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
              textBorderColor: "#fff",
              borderColor: "#fff",
              textBorderWidth: 0,
              show: false,
              textBorderColor: "#fff",
            },
          },
          blur: {},

          select: {
            itemStyle: {
              color: null,
              borderColor: "#fff",
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
      registerMap("SccPanel", {
        svg: SccPanel,
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
  height: 60vh;
  /* width: 140vh; */
}
</style>

<style >
body {
  margin: 0;
}
</style>