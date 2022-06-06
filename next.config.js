if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}

const withLess = require("@zeit/next-less"),
  nextConfig = {
    target: "serverless",
    env: {
      weatherApi: "YOUR_WEATHER_API_KEY",
      mapBoxApi: "YOUR_MAP_BOX_API_KEY"
    },
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60,
      pagesBufferLength: 5
    },
    lessLoaderOptions: {
      javascriptEnabled: true
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }

      config.module.rules.push(
        {
          test: /\.md$/,
          use: "raw-loader",
        }
      );

      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals)
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: "null-loader"
        });
      }
      return config;
    }
  };

module.exports = withLess(nextConfig);
