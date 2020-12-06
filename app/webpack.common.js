const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        app: './index.js',
        uikit: './uikit.js'
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        //new HtmlWebpackPlugin({
        //  title: 'Production',
        //}),
        // new WorkboxPlugin.GenerateSW({
        //     clientsClaim: true,
        //     skipWaiting: true,
        //     maximumFileSizeToCacheInBytes: 5*1024*1024
        // }),
    ],
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'build/js'),
    },
    performance: {
        hints: false, //'warning',
        //maxEntrypointSize: 4 * 1024 * 1024,
        //maxAssetSize: 10 * 1024 * 1024
    }
};