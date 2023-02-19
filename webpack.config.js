const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { options } = require('yargs')


module.exports = (enc, argv) => {

    const isProd = argv.mode === 'production'
    const isDev = !isProd

    console.log('isProd', isProd)
    console.log('isDev', isDev)

    const filename = ext => isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`
    const plugins = () => {
        const base = [
            new HtmlWebpackPlugin({
                template: './index.html'
            }),
            new CopyPlugin({
                patterns: [
                { from: path.resolve(__dirname, 'src', 'favicon.ico'), 
                to: path.resolve(__dirname, 'dist') }
                ],
            }),
            new MiniCssExtractPlugin({
                filename: filename('css')
            }),
            new CleanWebpackPlugin(),
            new ESLintPlugin()
        ]

        if(isDev) {
            base.push(new ESLintPlugin())
        }

        return base
    }

    return {
        target: 'web',
        context: path.resolve(__dirname, 'src'),
        entry: {
            main: [
                'core-js/stable',
                'regenerator-runtime/runtime',
                './index.js'
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: filename('js')
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@': path.resolve(__dirname, 'src', 'core')
            }
        },
        devServer: {
            port: 9000,
            open: true,
            hot: true,
            watchFiles: './',
        },

        devtool: isDev ? 'source-map' : false,
        module: {
            rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                // Creates `style` nodes from JS strings
                MiniCssExtractPlugin.loader,
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env']
                }
                }
            },
            ],
        },
    }
}