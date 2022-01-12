const scriptSetup = require('unplugin-vue2-script-setup/webpack')
const webpack = require('webpack')
const pkg= require('./package.json')
const CompressionPlugin = require('compression-webpack-plugin')
const AutoZip = require('webpack-auto-zip')

process.env.VUE_APP_VER = pkg.version
process.env.VUE_APP_BUILD = new Date().toLocaleString()
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
    }
}
