const address = require('address');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  env: {
    LOCAL_IP: address.ip()
  },
  future: {
    webpack5: true
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    /////////////////////////////
    if (!config.resolve.plugins) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    } else {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    }
    /////////////////////////////
    return config;
  }
};

console.log('\x1b[32m%s\x1b[0m', 'ready', '- started server on http://'+address.ip()+':3000');