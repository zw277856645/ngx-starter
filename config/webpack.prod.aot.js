var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var BaseHrefModule = require('base-href-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ngtools = require('@ngtools/webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var helpers = require('./helpers');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    entry: {
        'app': './src/main.aot.ts'
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                loader: 'babel-loader'
            },
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            }
        ]
    },

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
        new BaseHrefModule.BaseHrefWebpackPlugin({ baseHref: '/' }),
        new webpack.NoEmitOnErrorsPlugin(),
        new UglifyJSPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new CleanWebpackPlugin([ 'dist' ], {
            root: helpers.root(),
            watch: true
        }),
        new CopyWebpackPlugin([ { from: './app.config.json' } ]),
        new ngtools.AngularCompilerPlugin({
            tsConfigPath: 'src/tsconfig.aot.json',
            entryModule: 'src/app/app.module.aot#AppModuleAot',
            sourceMap: true
        })
    ]
});

