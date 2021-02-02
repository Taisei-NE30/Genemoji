import type { AWS } from '@serverless/typescript';

import { hello, generateEmoji } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'generateemoji',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    serverlessLayers: {
      packageManager: 'yarn'
    },
  },
  plugins: ['serverless-webpack', 'serverless-layers'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    stage: 'prd',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, generateEmoji }
}

module.exports = serverlessConfiguration;
