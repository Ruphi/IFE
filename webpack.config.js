/*
 *Created on 2018/5/5.
 *by fxp  
 */
const path = require('path');

module.exports = {
    entry:{
        index:'./src/index.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname+'/dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                },{
                    loader: 'css-loader'
                }]
            },
            {
                test:/\.js$/,
                exclude:/(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets:['env']
                    }
                }
            }
        ]
    }
};