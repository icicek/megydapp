const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "url": require.resolve("url/"),
          "zlib": require.resolve("browserify-zlib"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "assert": require.resolve("assert"),
          "buffer": require.resolve("buffer"),
          "process": require.resolve("process/browser"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ],
    },
  },
};
