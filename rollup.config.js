import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs';

var name = "TDConsentManager"

var babelConfig = {
  exclude: /node_modules\/(?!(lit-element|lit-html)\/).*/,
  babelHelpers: 'runtime',
  skipPreflightCheck: true
}

var filesizeConfig = {
  showGzippedSize: true,
  showBrotliSize: false,
  showMinifiedSize: false,
}

let plugins = [
  resolve(),
  commonjs(),
  babel(babelConfig),
  filesize(filesizeConfig)
]

export default {
  input: 'lib/index.js',
  output: [
    {
      file: './dist/td-cm.js',
      format: 'umd',
      name
    },
    {
      file: './dist/td-cm.min.js',
      format: 'umd',
      plugins: [ terser({
        output: {
          comments: false
        }
      }) ],
      name
    }
  ],
  plugins
}
