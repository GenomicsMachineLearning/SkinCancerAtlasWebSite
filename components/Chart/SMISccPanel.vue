<template>
  <div>
    <div ref="testLine" class="chart"></div>
    <!-- Button trigger modal -->

    <!-- Modal -->
    <div>
      <div
        v-if="showModal"
        class="
          overflow-x-hidden
          fixed
          inset-0
          z-50
          outline-none
          focus:outline-none
          justify-center
          items-center
          overflow-y-auto
        "
      >
        <div class="w-auto my-6 mx-auto max-w-6xl">
          <!--content-->
          <div
            class="
              border-0
              rounded-lg
              shadow-lg
              relative
              flex flex-col
              w-full
              bg-white
              outline-none
              focus:outline-none
            "
          >
            <!--header-->
            <div
              class="
                flex
                items-start
                justify-between
                p-5
                border-b border-solid border-slate-200
                rounded-t
              "
            >
              <h3 class="text-3xl font-semibold">SCC - CosMx datasets</h3>
              <button
                class="
                  p-1
                  ml-auto
                  bg-transparent
                  border-0
                  text-black
                  float-right
                  text-3xl
                  leading-none
                  font-semibold
                  outline-none
                  focus:outline-none
                "
                v-on:click="toggleModal()"
              >
                <span
                  class="
                    bg-transparent
                    text-black
                    h-6
                    w-6
                    text-4xl
                    block
                    outline-none
                    focus:outline-none
                  "
                >
                  ×
                </span>
              </button>
            </div>
            <!--body-->
            <div class="relative flex-auto p-3">
              <div class="w-full col overflow-auto">
                <div class="w-full col">
                  <nx-card>
                    <template slot="header">
                      <nx-card-header> </nx-card-header>
                    </template>
                    <template slot="body">
                      <div class="flex items-center justify-center">
                        <img
                          class="object-cover"
                          src="@/assets/images/panels/spatial_metadata/scc/SMIPanel.png"
                          alt="blue"
                        />
                      </div>
                    </template>
                  </nx-card>
                </div>
              </div>
            </div>
            <div class="pt-10 flex items-center justify-center">
              <img
                class="w-1/2 justify-center content-center"
                src="@/assets/images/panels/SMI_annotation.png"
                alt="blue"
              />
            </div>
            <!--footer-->
            <div
              class="
                flex
                items-center
                justify-end
                p-6
                border-t border-solid border-slate-200
                rounded-b
              "
            >
              <button
                class="
                  text-red-500
                  bg-transparent
                  border border-solid border-red-500
                  hover:bg-red-500 hover:text-white
                  active:bg-red-600
                  font-bold
                  uppercase
                  text-sm
                  px-6
                  py-3
                  rounded
                  outline-none
                  focus:outline-none
                  mr-1
                  mb-1
                  ease-linear
                  transition-all
                  duration-150
                "
                type="button"
                v-on:click="toggleModal()"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showModal"
        class="opacity-25 fixed inset-0 z-40 bg-black"
      ></div>
    </div>
  </div>
</template>

<script>
import "echarts";
import { init, use, registerMap } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import { TitleComponent, VisualMapComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import SMISccPanel from "@/assets/images/panels/SMISccPanel.svg?raw";

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
        geo: {
          map: "SMISccPanel",
          layoutCenter: ["50%", "50%"],
          layoutSize: "100%",
          selectedMode: "single",
          itemStyle: {
            borderColor: null,
          },
          emphasis: {
            focus: "self",
            itemStyle: {
              color: null,
            },
            label: {
              position: "bottom",
              distance: 0,
              textBorderColor: "#fff",
              textBorderWidth: 2,
              show: false,
            },
          },
          blur: {},
          select: {
            itemStyle: {
              color: null,
            },
            label: {
              show: false,
              textBorderColor: "#fff",
              textBorderWidth: 2,
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
      registerMap("SMISccPanel", {
        svg: SMISccPanel,
      });

      myChart.setOption(option);

      myChart.on("click", function () {
        toggleModal();
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
  height: 35vh;
  /* width: 35vh; */
}
</style>

<style >
body {
  margin: 0;
}
</style>