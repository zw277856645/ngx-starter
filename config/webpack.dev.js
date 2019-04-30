const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    mode: "development",

    output: {
        filename: '[name].js',
    },

    plugins: [
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            tsConfigPath: './src/tsconfig.app.json',
            sourceMap: true,
            nameLazyFiles: true,
            skipCodeGeneration: true
        }),
        new webpack.DefinePlugin({ 'process.env.PRODUCTION': false }),
        new CopyWebpackPlugin([ { from: './app.config.json' } ])
    ],

    devServer: {
        historyApiFallback: true,
        watchOptions: {
            ignored: [
                'node_modules',
                '**/*.spec.ts'
            ]
        }
    }
});
