
require('../index');

const Test = require('./testLib');

describe('on/off', async () => {
    test('should not be able to capture messages with requestIds', async () => {
        const callback1 = jest.fn().mockName('callback1');

        RingtailSDK.on('UserContext', callback1);

        const initPromise = RingtailSDK.initialize();
        Test.sendUserContextMessage();
        await initPromise;

        expect(callback1).toHaveBeenCalledTimes(0);
    });

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

    test('should call all callbacks even if one throws', () => {
        const callback1 = jest.fn(() => { throw new Error("Uh oh, we're SCROZZLED!"); }).mockName('callback1');
        const callback2 = jest.fn().mockName('callback2');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        RingtailSDK.on('Scrozzled', callback1);
        RingtailSDK.on('Scrozzled', callback2);

        Test.sendMessage({ name: 'Scrozzled', requestId: 42 });

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledTimes(1);

        RingtailSDK.off('Scrozzled', callback1);
        RingtailSDK.off('Scrozzled', callback2);
        consoleSpy.mockRestore();
    });

    test('should ignore un-watched messages and responses', () => {
        Test.sendMessage({ name: 'DireBadger', requestId: 42 });
        Test.sendMessage({ name: 'Bugbear' });
    });
});
