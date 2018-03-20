import commonConfig from './rollup.config.common';
import uglify from 'rollup-plugin-uglify';

export default {
  ...commonConfig,
  output: {
    ...commonConfig.output,
    file: 'dist/plasma.min.js',
  },
  plugins: [
    ...commonConfig.plugins,
    uglify({
      output: {
        comments(node, comment) {
          const { value: text, type } = comment;
          if (type === 'comment2') {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        },
      },
    }),
  ],
};
