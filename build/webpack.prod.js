const path = require('path');
const utils = require('../config/utils');
const config = require('../config');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

process.env.NODE_ENV = 'production';

const prodConfig = merge(common, {
    mode: 'production',
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
        publicPath: config.build.assetsPublicPath
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { safe: true, map: { inline: false } }
            })
        ],
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                },

            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),
    ],
});

const exist = prodConfig.optimization.splitChunks.cacheGroups;
prodConfig.optimization.splitChunks.cacheGroups = Object.assign({}, exist, utils.setCssSplit());

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    prodConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    prodConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prodConfig;