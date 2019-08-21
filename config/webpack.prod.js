const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { CleanCssWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
                loader: '@angular-devkit/build-optimizer/webpack-loader',
                options: { sourceMap: true }
            },
            {
                test: /\.js$/,
                exclude: /(ngfactory|ngstyle).js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            },
            {
                test: /\.js$/,
                exclude: [ /node_modules\/(?!(dom7|swiper)\/).*/ ],
                loader: 'babel-loader',
                options: { presets: [ '@babel/env' ] }
            }
        ]
    },

    optimization: {
        noEmitOnErrors: true,
        minimizer: [
            new webpack.HashedModuleIdsPlugin(),
            new TerserPlugin({
                sourceMap: true,
                cache: true,
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        pure_getters: true,
                        passes: 3,
                        inline: 3,
                        // fix bug - ngDevMode is not defined
                        global_defs: require('@angular/compiler-cli').GLOBAL_DEFS_FOR_TERSER
                    }
                }
            }),
            new CleanCssWebpackPlugin({
                sourceMap: true,
                test: (file) => /\.(?:css)$/.test(file)
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

