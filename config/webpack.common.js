const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const { SuppressExtractedTextChunksWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/suppress-entry-chunks-webpack-plugin');
const { IndexHtmlWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const helpers = require('./helpers');

module.exports = {

    node: false,

    devtool: 'source-map',

    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    },

    resolve: {
        extensions: [ '.ts', '.js' ],
        alias: rxPaths()
    },

    output: {
        path: helpers.root('dist')
    },

    performance: {
        hints: false
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [ /\.(spec|e2e)\.ts$/ ],
                loader: '@ngtools/webpack'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // 资源转换成base64，超出limit交给file-loader处理
            {
                test: /\.(png|svg|jpe?g|gif|woff|woff2|eot|ttf|ico)$/,
                loader: 'url-loader',
                options: {
                    name: 'asset/[name].[hash].[ext]',
                    limit: 8192
                }
            },
            // app内css/less
            {
                test: /\.(css|less)$/,
                include: [ helpers.root('src/app') ],
                use: [
                    'to-string-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            // app外css|less
            {
                test: /\.(css|less)$/,
                exclude: [ helpers.root('src/app') ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            // 隐藏webpack抛出的deprecation警告
            {
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true },
            }
        ]
    },

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                common: {
                    name: 'common',
                    chunks: 'all',
                    minChunks: 2,
                    enforce: true
                }
            }
        }
    },

    plugins: [
        new IndexHtmlWebpackPlugin({
            input: 'index.html',
            entrypoints: [
                'polyfills',
                'vendor',
                'app'
            ]
        }),
        new ProgressPlugin(),
        // 避免样式入口文件(entry -> style.css)生成对应的js(style.js)
        new SuppressExtractedTextChunksWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
        new CircularDependencyPlugin({ exclude: /node_modules/ }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CopyWebpackPlugin([
            {
                from: './src/favicon.png'
            }
        ])
    ]
};