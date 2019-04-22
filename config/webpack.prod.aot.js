const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BaseHrefModule = require('base-href-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js');

// for dynamic module
// 禁止ngtools删除元数据。官方没有提供配置，采用hack处理
require('./hack-remove-decorators').hack();

module.exports = webpackMerge(commonConfig, {

    entry: {
        'app': './src/main.aot.ts'
    },

    devtool: 'cheap-module-source-map',

    module: {
        loaders: [
            // for dynamic module
            // ngtools没有处理动态组件的templateUrl，使用template:require(templateUrl)同样不行(ngtools的bug)
            {
                test: /\.ts$/,
                exclude: [ /\.(spec|e2e)\.ts$/ ],
                loader: 'angular2-template-loader'
            },
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

