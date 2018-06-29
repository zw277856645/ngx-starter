var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BaseHrefModule = require('base-href-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    entry: {
        'app': './src/main.ts'
    },

    devtool: 'cheap-source-map',

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: helpers.root('src', 'tsconfig.json') }
                    },
                    'angular2-template-loader'
                ]
            }
        ]
    },

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
            helpers.root('./src'),
            {}
        ),
        new BaseHrefModule.BaseHrefWebpackPlugin({ baseHref: '/' }),
        new ExtractTextPlugin('[name].css'),
        new CopyWebpackPlugin([ { from: './app.config.json' } ])
    ],

    devServer: {
        historyApiFallback: true,
        host: 'localhost',
        port: 8080,
        watchOptions: {
            ignored: /node_modules/
        }
    }
});
