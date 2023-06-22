const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    name: "client",
    entry: {
        client: path.resolve(__dirname, "react-app/"),
    },
    mode: "development",
    output: {
        path: path.resolve(__dirname + "/dist/static"),
        filename: "bundle.js",
        publicPath: "",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json",
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.svg$/,
            //     // loader: "react-svg-loader",
            //     loader: "raw-loader",
            //     options: {
            //         jsx: true // true outputs JSX tags
            //     }
            // }
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ],
    },
    target: "web",
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'public' }
            ]
        }),
    ],
};
