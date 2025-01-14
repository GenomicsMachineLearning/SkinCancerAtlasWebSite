export default {
    // Target (https://go.nuxtjs.dev/config-target)
    target: 'static',

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'UQ-IMB',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        "~/assets/scss/app.scss",
        "~/assets/scss/icons.scss",
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        {src: "~/plugins/vue-apexcharts", mode: 'client'},
        {src: "~/plugins/epic-spinners", mode: 'client'},
        '@/plugins/vue-snap',
        '~plugins/vue-js-modal.js'
    ],

    // Import all .vue files
    components: [
        {
            path: '~/components',
            pathPrefix: false,
            pattern: '**/*.vue'
        },
    ],

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/tailwindcss
        '@nuxtjs/tailwindcss',
        '@nuxtjs/fontawesome',
        '@nuxtjs/google-fonts',
        '@nuxtjs/color-mode',
        '@aceforth/nuxt-optimized-images',
        '@nuxtjs/composition-api/module',
        "@nuxtjs/svg",
    ],

    tailwindcss: {
        // add '~tailwind.config` alias
        exposeConfig: true
    },

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/style-resources',
        'nuxt-vue-select',
        'nuxt-vue-multiselect',
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {},

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        analyze: true,
        // or
        analyze: {
            analyzerMode: 'static'
        },
        transpile: [/echarts/, /zrender/]
    },

    // Google fonts config
    googleFonts: {
        families: {
            "Exo 2": [400, 500, 600, 700, 800],
        }
    },

    styleResources: {
        scss: [
            './assets/scss/_variables.scss',
        ]
    },


    optimizedImages: {
        optimizeImages: true,
        handleImages: ['jpeg', 'png', 'webp', 'gif']
    },

    // Colormode config
    colorMode: {
        classSuffix: ''
    },
    loading: {
        color: 'DodgerBlue',
        height: '10px',
        continuous: true,
        duration: 3000,
        throttle: 0
    },
    loadingIndicator: {
        name: 'wandering-cubes',
        color: 'white',
        background: '#fb6f92'
    },
    ssr: false,
    svg: {
        vueSvgLoader: {
            // vue-svg-loader options
        },
        svgSpriteLoader: {
            // svg-sprite-loader options
        },
        fileLoader: {
            // file-loader options
        }
    },
    purgeCSS: {
        whitelistPatterns: [
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^(?!(|.*?:)cursor-move).+-move$/,
            /^nuxt-link(|-exact)-active$/,
            /multiselect/
        ]
    },

}
