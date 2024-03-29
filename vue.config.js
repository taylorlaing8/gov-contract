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

    pluginOptions: {},

    css: {
        loaderOptions: {
            scss: {
                // the change was made here (match the option name with file extension)
                additionalData: `
                  @import "@/assets/scss/main.scss";
                `,
            },
        },
    },
})
