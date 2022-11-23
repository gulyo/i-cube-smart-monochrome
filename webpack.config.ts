import * as path from "path";
import { Configuration } from "webpack";
import nodeExternals = require("webpack-node-externals");
import CopyPlugin = require("copy-webpack-plugin");

const config: Configuration = {
  mode: "production",
  target: "node",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".nvmrc", to: "./" }],
    }),
  ],
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "iCubeSmart.js",
    path: path.resolve(__dirname, "bundle"),
    library: { type: "commonjs2" },
  },
};

export default config;
