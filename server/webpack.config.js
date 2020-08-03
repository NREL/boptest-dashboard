const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: './index.ts',
  target: 'node',
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, '../build/server'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                outDir: path.resolve(__dirname, '../build/server'),
              },
            },
          },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['npm run run:dev'],
    }),
  ],
};
