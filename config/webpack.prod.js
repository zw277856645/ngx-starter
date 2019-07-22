const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanCssWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    mode: "production",

    output: {
        filename: '[name].[hash].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(ngfactory|ngstyle).js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            }
        ]
    },

    optimization: {
        noEmitOnErrors: true,
        minimizer: [
            new webpack.HashedModuleIdsPlugin(),
            new UglifyJSPlugin({
                sourceMap: true,
                cache: true,
                parallel: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        pure_getters: true,
                        passes: 3,
                        inline: 3
                    }
                }
            }),
            new CleanCssWebpackPlugin({
                sourceMap: true,
                test: (file) => /\.(?:css)$/.test(file),
            })
        ]
    },

    plugins: [
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            tsConfigPath: './src/tsconfig.app.json',
            sourceMap: true,
            nameLazyFiles: false,
            skipCodeGeneration: false
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({ 'process.env.PRODUCTION': true }),
        new CopyWebpackPlugin([ { from: './app.config.json' } ])
    ]
});

