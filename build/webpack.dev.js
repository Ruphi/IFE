const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const utils = require('../config/utils');
const config = require('../config');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devConfig = merge(common, {
    mode: 'development',
    devtool: config.dev.devtool,
    output: {
        path: config.dev.assetsRoot,
        filename: utils.assetsPath('js/[name].[hash].js'),
        chunkFilename: utils.assetsPath('js/[name].[hash].js'),
        publicPath: config.dev.assetsPublicPath
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
});

module.exports = devConfig;