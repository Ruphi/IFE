const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

module.exports = {
    getEntry: function () {
        const entries = {};
        let fileArr = [];
        fileArr = glob.sync('./src/pages/**/*.js');
        fileArr.forEach(function (pat) {
            let pathArr = pat.split('/');
            entries[pathArr[pathArr.length-2]] = pat;
        });
        return entries;
    },
    setHtmlWebpackPlugin: function () {
        const HtmlWebpackPluginArr = [];
        const fileArr = glob.sync('./src/pages/**/*.html');
        for (let i = 0; i < fileArr.length; i++) {
            let name = fileArr[i].split('/')[fileArr[i].split('/').length-2];
            HtmlWebpackPluginArr.push(new HtmlWebpackPlugin({
                filename: name+'.html',
                template: fileArr[i],
                chunks: ['manifest', 'vendor', name]
            }));
        }
        return HtmlWebpackPluginArr;
    },
    setCssSplit: function () {
        const styleObj = {};
        const fileArr = glob.sync('./src/pages/**/*.html');
        for (let i = 0; i < fileArr.length; i++) {
            let name = fileArr[i].split('/')[fileArr[i].split('/').length-2];
            styleObj[name+'Styles'] = {
                name: name,
                test: (m, c, entry = name) =>
                    m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                chunks: 'all',
                enforce: true
            }
        }
        return styleObj;
    },
    assetsPath: function (_path) {
        const assetsSubDirectory = process.env.NODE_ENV === 'production'
            ? config.build.assetsSubDirectory
            : config.dev.assetsSubDirectory;

        return path.posix.join(assetsSubDirectory, _path)
    },
};