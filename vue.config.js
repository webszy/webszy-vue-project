'use strict'
// const path = require('path')
const TerserJSPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const AutoZip = require('webpack-auto-zip')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const pkg = require('./package.json')
function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}
process.env.VUE_APP_BUILD_TIME = parseTime(new Date())
process.env.VUE_APP_VERSION = pkg.version
module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  // publicPath:'/baseline/',
  productionSourceMap: false,
  pluginOptions: {
    // webpackBundleAnalyzer: {openAnalyzer: process.env.ANALYZE==='true'}
  },
  css: {
    extract: true
  },
  // devServer:{
  //   proxy:{
  //   '^/hp':{
  //     target: 'https://api.solotech.me/api/sessions/hp', // 接口的域名
  //     changeOrigin: true // 如果接口跨域，需要进行这个参数配置
  //     }
  //   }
  // },
  configureWebpack: config => {
    // console.log(config)
    config.plugins.push(
      new CompressionPlugin({
        /* [file]被替换为原始资产文件名。
           [path]替换为原始资产的路径。
           [dir]替换为原始资产的目录。
           [name]被替换为原始资产的文件名。
           [ext]替换为原始资产的扩展名。
           [query]被查询替换。 */
        filename: '[path].gz[query]',
        // 压缩算法
        algorithm: 'gzip',
        // 匹配文件
        test: /\.js$|\.css$|\.html$/,
        // 压缩超过此大小的文件,以字节为单位
        threshold: 10240,
        minRatio: 0.8,
        // 删除原始文件只保留压缩后的文件
        deleteOriginalAssets: false
      })
    )
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new AutoZip(`${pkg.name}_${pkg.version}_${process.env.VUE_APP_BUILD_ENV}.zip`))
    }
    config
      .optimization = {
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        minimize: true,
        minimizer: [
          new TerserJSPlugin({
            cache: true,
            parallel: true,
            sourceMap: false
          })
        ],
        splitChunks: {
          chunks: 'initial',
          // minSize: 0,
          // maxSize: 200000,
          minChunks: 2,
          maxAsyncRequests: 5,
          maxInitialRequests: 5,
          cacheGroups: {
            default: false,
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              minChunks: 2,
              // maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              minChunks: 2,
              // maxSize: 1024 * 300,
              chunks: 'initial',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        },
        runtimeChunk: {
          name: 'manifest'
        }
      }
    // config.optimization.runtimeChunk('single')
  }
}
