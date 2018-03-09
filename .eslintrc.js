module.exports = {
    extends: 'eslint:recommended',
    env: {
        browser: true,
        es6: true,
    },
    globals: {
        RingtailSDK: false,
    },
    rules: {
        'no-console': 0,
    },
};