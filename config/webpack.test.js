const webpack = require('webpack');

module.exports = {

    mode: "development",

    devtool: 'inline-source-map',

    performance: {
        hints: false
    },

    resolve: {
        extensions: [ '.ts', '.js' ]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                    'angular-router-loader',
                    'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|svg|jpe?g|gif|woff|woff2|eot|ttf|ico)$/,
                loader: 'url-loader',
                options: {
                    name: 'asset/[name].[ext]',
                    limit: 8192
                }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true },
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};

