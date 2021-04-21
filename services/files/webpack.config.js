/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

const isLocal = slsw.lib.webpack.isLocal;

const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: '12',
                    },
                },
            ],
            ['@babel/preset-typescript'],
        ],
    },
};

const cacheLoader = {
    loader: 'cache-loader',
    options: {
        cacheDirectory: path.resolve('.webpackCache'),
    },
};

const tsLoader = {
    loader: 'ts-loader',
    options: {
        configFile: 'tsconfig.build.json',
        transpileOnly: true
    },
};

module.exports = {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    externals: [nodeExternals(), 'sharp', 'aws-sdk'],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [cacheLoader, babelLoader],
            },
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [cacheLoader, babelLoader, tsLoader],
            },
        ],
    },
};
