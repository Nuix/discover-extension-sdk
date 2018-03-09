
require('../index');

const Test = require('./testLib');

test('setup', async () => {
    const initPromise = RingtailSDK.initialize();
    Test.sendUserContextMessage();
    await initPromise;
});

describe('on/off', async () => {
    test('should throw given invalid parameters', () => {
        expect(RingtailSDK.on).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, false)).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, 0xDeadBeef)).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, {})).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, [])).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, () => {})).toThrow(/eventName/);
        expect(RingtailSDK.on.bind(null, '')).toThrow(/eventName/);

        expect(RingtailSDK.on.bind(null, 'a')).toThrow(/callback/);
        expect(RingtailSDK.on.bind(null, 'a', false)).toThrow(/callback/);
        expect(RingtailSDK.on.bind(null, 'a', 0xDeadBeef)).toThrow(/callback/);
        expect(RingtailSDK.on.bind(null, 'a', {})).toThrow(/callback/);
        expect(RingtailSDK.on.bind(null, 'a', [])).toThrow(/callback/);
        expect(RingtailSDK.on.bind(null, 'a', 'SCROZZLED')).toThrow(/callback/);
    });

    test('should ignore double-registration of a callback', () => {
        const callback1 = jest.fn().mockName('callback1');

        RingtailSDK.on('Scrozzled', callback1);
        RingtailSDK.on('Scrozzled', callback1);

        Test.sendMessage({ name: 'Scrozzled' });
        expect(callback1).toHaveBeenCalledTimes(1);

        callback1.mockClear();

        RingtailSDK.off('Scrozzled', callback1);

        Test.sendMessage({ name: 'Scrozzled' });
        expect(callback1).toHaveBeenCalledTimes(0);

        RingtailSDK.off('Scrozzled', callback1);
    });
});
