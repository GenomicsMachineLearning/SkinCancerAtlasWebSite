<template>
  <div v-if="loading" id="loading-wrapper">
    <div id="loading-text">LOADING</div>
    <div id="loading-content"></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style scoped>
body {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /*centers items on the line (the x-axis by default)*/
  align-items: center; /*centers items on the cross-axis (y by default)*/
}
#loading-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220px;
}

#loading-text {
  color: #000;
  text-align: center;
  font-family: "PT Sans Narrow", sans-serif;
  font-size: 20px;
}

#loading-content {
  width: 100px;
  height: 100px;
  border: 3px solid transparent;
  border-top-color: #4d658d;
  border-bottom-color: #4d658d;
  border-radius: 50%;
  -webkit-animation: loader 6s ease infinite;
  -moz-animation: loader 6s ease infinite;
  -o-animation: loader 6s ease infinite;
  animation: loader 6s ease infinite;
}

#loading-content:after {
  content: "";
  position: absolute;
  border: 3px solid #0f0;
  left: 15px;
  right: 15px;
  top: 15px;
  bottom: 15px;
  border: 3px solid transparent;
  border-top-color: #84417c;
  border-bottom-color: #84417c;
  border-radius: 50%;
  -webkit-animation: loader 3s ease infinite;
  animation: loader 3s ease infinite;
  -moz-animation: loader 3s ease infinite;
  -o-animation: loader 3s ease infinite;
}

#loading-content:before {
  content: "";
  position: absolute;
  border: 3px solid #00f;
  left: 5px;
  right: 5px;
  top: 5px;
  bottom: 5px;
  border: 3px solid transparent;
  border-top-color: #d4cc6a;
  border-bottom-color: #d4cc6a;
  border-radius: 50%;
  -webkit-animation: loader 2s ease infinite;
  -moz-animation: loader 2s ease infinite;
  -o-animation: loader 2s ease infinite;
  animation: loader 2s ease infinite;
}

@-webkit-keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
