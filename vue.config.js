const scriptSetup = require('unplugin-vue2-script-setup/webpack')
const webpack = require('webpack')
const pkg= require('./package.json')
const CompressionPlugin = require('compression-webpack-plugin')
const AutoZip = require('webpack-auto-zip')
const TerserJSPlugin = require("terser-webpack-plugin");

process.env.VUE_APP_VER = pkg.version
process.env.VUE_APP_BUILD = new Date().toLocaleString()
const packNameList = new Array(60).fill('').map((e, i) => ({name: `package${i}`, count: 0}))

module.exports = {
    configureWebpack: config => {
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
            }),
            scriptSetup(),
            new webpack.DefinePlugin({
                BuildTime: JSON.stringify(process.env.VUE_APP_BUILD),
                _env: JSON.stringify({
                    buildTime: process.env.VUE_APP_BUILD,
                    ver: process.env.VUE_APP_VER,
                    isProduction: process.env.VUE_APP_ENV === 'production',
                    isSandbox: process.env.VUE_APP_ENV === 'sandbox',
                    env: process.env.VUE_APP_ENV,
                    command: process.env.NODE_ENV
                })
            })
        )
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new AutoZip(`${pkg.name}_${pkg.version}_${process.env.VUE_APP_ENV}.zip`))
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
                    sourceMap: false,
                }),
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
                        name: "chunk-common",
                        chunks: "initial",
                        minChunks: 2,
                        // maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    vendors: {
                        // name: "chunk-vendors",
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1].toLowerCase()
                            const index = packNameList.findIndex(e => e.count <= 15)
                            if (index > -1 && packageName.indexOf('vue') === -1) {
                                const one = packNameList[index]
                                packNameList[index].count = packNameList[index].count + 1
                                return one.name
                            }
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `package.${packageName.replace('@', '')}`
                        },
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 2,
                        maxSize: 1024 * 300,
                        chunks: "initial",
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
    }

}
