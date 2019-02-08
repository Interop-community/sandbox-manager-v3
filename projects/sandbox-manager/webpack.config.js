const path = require("path");
const webpack = require("webpack");
const fs = require('fs');

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pkg = require("./package.json");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3001;
const SRC_DIR = path.resolve(__dirname, "src");
const DIST_DIR = path.resolve(__dirname, "build/www");
const LIB_DIR = fs.realpathSync(path.resolve(__dirname, "../../node_modules/sandbox-manager-lib"));
const APP_VERSION = JSON.stringify(pkg.version);
const ENV = process.env.NODE_ENV || "production";

const config = {
    entry: {
        vendor: [
            "babel-polyfill",
            "jwt-decode",
            "lodash",
            "lodash.throttle",
            "material-ui",
            "prop-types",
            "react",
            "react-dom",
            "react-redux",
            "react-router",
            "react-router-dom",
            "redux",
            "redux-logger",
            "redux-thunk",
            "whatwg-fetch"
        ],
        bundle: SRC_DIR + "/index.jsx"
    },

    output: {
        path: DIST_DIR,
        filename: "[name]-[chunkhash].js",
        publicPath: "/"
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: [/node_modules\/(?!(sandbox-manager-lib)\/).*/, /externals/, /__storage__/],
                include: [SRC_DIR, LIB_DIR],
                use: ExtractTextPlugin.extract({
                    use: ["css-loader?minimize", "postcss-loader"]
                })
            },
            {
                test: /\.less$/,
                exclude: [/node_modules\/(?!(sandbox-manager-lib)\/).*/, /externals/, /__storage__/],
                include: [SRC_DIR, LIB_DIR],
                use: ExtractTextPlugin.extract({
                    use: ["css-loader?minimize", "postcss-loader", "less-loader"]
                })
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: [/node_modules\/(?!(sandbox-manager-lib)\/).*/, /externals/, /__storage__/],
                include: [SRC_DIR, LIB_DIR],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "react-es2015",
                            "es2015",
                            "es2016",
                            "stage-0",
                            "stage-1",
                            "stage-2",
                            "stage-3"
                        ]
                    }
                }
            }
        ]
    },

    resolve: {
        extensions: [".js", ".jsx"]
    },

    context: __dirname,

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(ENV),
            NODE_ENV: JSON.stringify(ENV),
            APP_VERSION
        }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "manifest"]
        }),

        new CopyWebpackPlugin(
            [
                {
                    from: SRC_DIR + "/assets/data/xsettings." + ENV + ".json",
                    to: DIST_DIR + "/data/xsettings.json"
                },
                {
                    from: SRC_DIR + "/assets/config/export-resources_1_0_2.json",
                    to: DIST_DIR + "/data/export-resources_1_0_2.json"
                },
                {
                    from: SRC_DIR + "/assets/config/export-resources_1_8_0.json",
                    to: DIST_DIR + "/data/export-resources_1_8_0.json"
                },
                {
                    from: SRC_DIR + "/assets/config/export-resources_3_0_1.json",
                    to: DIST_DIR + "/data/export-resources_3_0_1.json"
                },
                {
                    from: SRC_DIR + "/assets/config/export-resources_3_4_0.json",
                    to: DIST_DIR + "/data/export-resources_3_4_0.json"
                },
                {
                    from: SRC_DIR + "/assets/img/favicon.ico",
                    to: DIST_DIR
                },
                {
                    from: SRC_DIR + "/assets/img",
                    to: DIST_DIR + "/img/"
                },
                {
                    from: SRC_DIR + "/../../../node_modules/fhirclient/fhir-client.min.js",
                    to: DIST_DIR + "/externals/"
                },
                {
                    from: SRC_DIR + "/../../../node_modules/font-awesome/css",
                    to: DIST_DIR + "/css/font-awesome/css/"
                },
                {
                    from: SRC_DIR + "/../../../node_modules/font-awesome/fonts",
                    to: DIST_DIR + "/css/font-awesome/fonts/"
                },
                {
                    from: SRC_DIR + "/../externals/iconfonts",
                    to: DIST_DIR + "/css/iconfonts/"
                },
                {
                    from: SRC_DIR + "/../externals/roboto",
                    to: DIST_DIR + "/css/roboto/"
                },
                {
                    from: SRC_DIR + "/../../../node_modules/moment/min/moment.min.js",
                    to: DIST_DIR + "/externals/"
                }
            ],
            {
                ignore: [".DS_Store"]
            }
        ),

        new ExtractTextPlugin("[name]-[contenthash].min.css"),

        new HtmlWebpackPlugin({
            filename: DIST_DIR + "/index.html",
            template: SRC_DIR + "/index.ejs"
        })
    ],

    devtool: "source-map",

    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },

    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        host: HOST,
        port: PORT,
        publicPath: "/",
        watchOptions: {
            ignored: /node_modules\/(?!(sandbox-manager-lib)\/).*/,
            aggregateTimeout: 300
        }
    }
};

// Production ------------------------------------------------------------------
if (ENV === "production") {
    config.plugins.push(new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: { ecma: 8 }
    }));
}

console.log("::: ENV:", ENV);
console.log("::: APP_VERSION:", APP_VERSION);

module.exports = config;
