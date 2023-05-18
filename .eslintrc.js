module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      js: 'always',
    }],
    'no-use-before-define': ['error', { functions: false }],
    // this is so you can keep the attribute object on the same line as the function call,
    // to make visually similar with the dom. e.g. p({ class: 'button-container' },
    'function-paren-newline': 'off',
    'no-return-await': 'off',
  },
};
