const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,

    devServer: {
        proxy: {
            '^/api': {
                target: process.env.VUE_APP_API_SERVER_ROUTE,
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
            },
        },
    },

    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        },
    },
})
