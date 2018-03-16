module.exports = {
    extends: 'eslint:recommended',
    plugins: [
        'jest'
    ],
    parserOptions: {
        ecmaVersion: 8,
    },
    env: {
        browser: true,
        es6: true,
        node: true,
        'jest/globals': true,
    },
    globals: {
        Ringtail: false,
    },
    rules: {
        'no-console': 0,
    },
};