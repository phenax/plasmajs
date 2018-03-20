import commonConfig from './rollup.config.common';

export default {
  ...commonConfig,
  output: {
    ...commonConfig.output,
    file: 'dist/plasma.js',
  },
};
