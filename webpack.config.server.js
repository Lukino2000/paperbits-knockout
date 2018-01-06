const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

//const selectedTheme = "paperbits";
const selectedTheme = "hostmeapp";

module.exports = {
    target: 'node',    
    entry: {
        'src.node/startup': './src.node/startup.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/server'),
        library: 'serverPublisher',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'server-tsconfig.json'
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
        //new webpack.optimize.ModuleConcatenationPlugin(),        
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