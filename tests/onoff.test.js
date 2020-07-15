
require('../Ringtail');

const Test = require('./testLib');

describe('on/off', () => {
    test('should not be able to capture messages with requestIds', async () => {
        const callback1 = jest.fn().mockName('callback1');

        Ringtail.on('UserContext', callback1);

        const initPromise = Ringtail.initialize();
        Test.sendUserContextMessage();
        await initPromise;

        expect(callback1).toHaveBeenCalledTimes(0);
    });

    test('should throw given invalid parameters', () => {
        expect(Ringtail.on).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, false)).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, 0xDeadBeef)).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, {})).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, [])).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, () => {})).toThrow(/eventName/);
        expect(Ringtail.on.bind(null, '')).toThrow(/eventName/);

        expect(Ringtail.on.bind(null, 'a')).toThrow(/callback/);
        expect(Ringtail.on.bind(null, 'a', false)).toThrow(/callback/);
        expect(Ringtail.on.bind(null, 'a', 0xDeadBeef)).toThrow(/callback/);
        expect(Ringtail.on.bind(null, 'a', {})).toThrow(/callback/);
        expect(Ringtail.on.bind(null, 'a', [])).toThrow(/callback/);
        expect(Ringtail.on.bind(null, 'a', 'SCROZZLED')).toThrow(/callback/);
    });

    test('should ignore double-registration of a callback', () => {
        const callback1 = jest.fn().mockName('callback1');

        Ringtail.on('Scrozzled', callback1);
        Ringtail.on('Scrozzled', callback1);

        Test.sendMessage({ name: 'Scrozzled' });
        expect(callback1).toHaveBeenCalledTimes(1);

        callback1.mockClear();

        Ringtail.off('Scrozzled', callback1);

        Test.sendMessage({ name: 'Scrozzled' });
        expect(callback1).toHaveBeenCalledTimes(0);

        Ringtail.off('Scrozzled', callback1);
    });

    test('should call all callbacks even if one throws', () => {
        const callback1 = jest.fn(() => { throw new Error("Uh oh, we're SCROZZLED!"); }).mockName('callback1');
        const callback2 = jest.fn().mockName('callback2');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        Ringtail.on('Scrozzled', callback1);
        Ringtail.on('Scrozzled', callback2);

        Test.sendMessage({ name: 'Scrozzled' });

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledTimes(1);

        Ringtail.off('Scrozzled', callback1);
        Ringtail.off('Scrozzled', callback2);
        consoleSpy.mockRestore();
    });

    test('should ignore un-watched messages and responses', () => {
        const callback1 = jest.fn().mockName('callback1');
        Ringtail.on('Scrozzled', callback1);

        Test.sendMessage({ name: 'DireBadger' });
        Test.sendMessage({ name: 'Bugbear' });
        Test.sendMessage({ name: 'Scrozzled', requestId: 7 }); // Messages with requestIds are never broadcast

        expect(callback1).toHaveBeenCalledTimes(0);
    });
});
