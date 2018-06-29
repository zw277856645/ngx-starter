var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

module.exports = {

    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts'
    },

    resolve: {
        extensions: [ '.ts', '.js' ]
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // assets
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=asset/[name].[hash].[ext]'
            },
            // 非app中less，打包成单独文件(vendor.css)
            {
                test: /\.(css|less)$/,
                exclude: [
                    helpers.root('src', 'app')
                ],
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?sourceMap&minimize!postcss-loader!less-loader'
                })
            },
            // app中css|less，内联
            {
                test: /\.(css|less)$/,
                include: [
                    helpers.root('src', 'app')
                ],
                loader: "to-string-loader!css-loader!postcss-loader!less-loader"
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: [ 'app', 'vendor', 'polyfills' ]
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.png'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(process.env.ENV)
            }
        })
    ]
};

