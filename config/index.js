'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: { // 设置域名代理
      "/user": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/user': '' }, // 将请求路径中的 /user 替换为空
      },
      "/core": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/core': '' }, // 将请求路径中的 /core 替换为空
      },
      "/coresection": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/coresection': '' }, // 将请求路径中的 /coresection 替换为空
      },
      "/storage": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/storage': '' }, // 将请求路径中的 /storage 替换为空
      },
      "/image": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/image': '' }, // 将请求路径中的 /image 替换为空
      },
      "/scan": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/scan': '' }, // 将请求路径中的 /scan 替换为空
      },
      "/reportview": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/reportview': '' }, // 将请求路径中的 /reportview 替换为空
      },
      "/mineral": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/mineral': '' }, // 将请求路径中的 /mineral 替换为空
      },
      "/permission": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/permission': '' },
      },
      "/supplier": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/supplier': '' },
      },
      "/warehouse": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/warehouse': '' },
      },
      "/inventory": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/inventory': '' },
      },
      "/inbound": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/inbound': '' },
      },
      "/outbound": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/outbound': '' },
      },
      "/sales": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/sales': '' },
      },
      "/yearly": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/yearly': '' },
      },
      "/monthly": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/monthly': '' },
      },
      "/records": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/records': '' },
      },
      "/profit": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/profit': '' },
      },
      "/exam": {
        target: "http://localhost:8080", // 代理服务器地址
        secure: false, // 如果是 https 接口，需要配置为 true
        ws: true, // 是否代理 websockets
        changeOrigin: true, // 允许跨域访问后端地址
        pathRewrite: { '^/exam': '' }, // 将请求路径中的 /exam 替换为空
      },
    },

    // 其他配置保持不变...
    host: 'localhost', // 可以通过 process.env.HOST 来覆盖
    port: 8000, // 如果端口被占用，会自动选择一个空闲的端口
    autoOpenBrowser: true, // 是否自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // 这里是用于 webpack-dev-server 的配置

    devtool: 'cheap-module-eval-source-map', // 开发模式的 source map 配置
    cacheBusting: true,
    cssSourceMap: true,
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'), // 打包后的文件路径

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'), // 打包输出路径
    assetsSubDirectory: 'static', // 静态资源路径
    assetsPublicPath: '/', // 公共路径

    // 生产环境的 source map 配置
    productionSourceMap: true,
    devtool: '#source-map',

    // 是否启用 Gzip 压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'], // Gzip 压缩的扩展名

    // 打包报告分析配置
    bundleAnalyzerReport: process.env.npm_config_report,
  }
}
