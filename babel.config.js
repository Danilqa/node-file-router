const sharedPresets = ['@babel/typescript'];
const shared = {
  ignore: ['src/**/*.spec.ts'],
  presets: sharedPresets
};

module.exports = {
  env: {
    esm: {
      ...shared,
      plugins: [['add-import-extension', { extension: 'mjs' }]]
    },
    cjs: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs'
          }
        ],
        ...sharedPresets
      ]
    }
  }
};
