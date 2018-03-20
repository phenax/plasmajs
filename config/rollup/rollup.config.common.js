import resolveNode from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
import { dirname, join } from 'path';

export function fromRootPath(...parts) {
  return join(dirname(__dirname), '..', ...parts);
}

export default {
  input: fromRootPath('app.jsx'),
  output: {
    file: 'plasma.js',
    dir: fromRootPath('dist'),
    format: 'iife',
    name: 'Plasma',
  },
  plugins: [
    resolveNode({ extensions: ['.js', '.json', '.jsx'], preferBuiltins: true }),
    json(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    commonjs({
      namedExports: {
        'node_modules/react-dom/server.js': ['renderToStaticMarkup'],
        'node_modules/react/index.js': [
          // based on https://github.com/facebook/flow/blob/master/lib/react.js
          'checkPropTypes',
          'createFactory',
          'initializeTouchEvents',
          'isValidElement',
          'Children',
          'cloneElement',
          'Component',
          'createClass',
          'createElement',
          'DOM',
          'Fragment',
          'PropTypes',
          'PureComponent',
        ],
      },
    }),
    // globals(),
    builtins(),
  ],
  // externals: ['lodash'],
};
