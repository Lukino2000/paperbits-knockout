const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

//const selectedTheme = "paperbits";
const selectedTheme = "hostmeapp";

module.exports = {
    entry: {
        paperbits: ['./src/startup.ts'],
        theme: [`./src/themes/${selectedTheme}/scripts/index.ts`]
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, 'dist/client')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json'
                },
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader?exportAsEs6Default"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/client']),
        new CopyWebpackPlugin([
            { from: 'src/assets' },     
            { from: 'src/styles/fonts', to: 'css/fonts' },        
            { from: `src/themes/${selectedTheme}/assets`},
            { from: `src/themes/${selectedTheme}/config.json`}      
        ]),
        new webpack.optimize.ModuleConcatenationPlugin(),        
        /**
         * Webpack plugin to optimize a JavaScript file for faster initial load
         * by wrapping eagerly-invoked functions.
         *
         * See: https://github.com/vigneshshanmugam/optimize-js-plugin
         */
        new OptimizeJsPlugin({            
            sourceMap: false
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".html"] 
    }
};