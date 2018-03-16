
require('../Ringtail');

const Test = require('./testLib');

describe('initialize', () => {
    test('all API calls should throw before initialize', () => {
        const ignoreList = new Set(['on', 'off', 'initialize']);
        const nonPromiseList = new Set(['getActiveDocument']);

        function tryCalling(obj) {
            Object.keys(obj || {}).forEach(key => {
                if (ignoreList.has(key)) {
                    return;
                }
                if (typeof obj[key] === 'function') {
                    if (nonPromiseList.has(obj[key].name)) {
                        expect(obj[key]).toThrow(/initialize/);
                    } else {
                        expect(obj[key]()).rejects.toThrow(/initialize/);
                    }
                } else {
                    tryCalling(obj[key]);
                }
            });
        }

        // Ensure EVERY function in the SDK (but those we've blacklisted above) throws
        // if we haven't yet initialized it.
        tryCalling(Ringtail);
    });

    test('should return a promise that resolves once acknowledged', async () => {
        const initPromise = Ringtail.initialize();

        expect(Test.postMessageMock).toHaveBeenCalledTimes(1);
        expect(Test.postMessageMock).toHaveBeenCalledWith({
            name: 'ExtensionReady',
            data: undefined,
            requestId: expect.any(Number),
        }, '*');

        const ackData = Test.sendUserContextMessage();

        expect(await initPromise).toEqual(ackData);
        expect(Ringtail.Context).toEqual(ackData);

        Test.postMessageMock.mockClear();
    });

    test('should noop and resolve immediately if called again', async () => {
        const initPromise = Ringtail.initialize();

        expect(Test.postMessageMock).toHaveBeenCalledTimes(0);
        expect(await initPromise).toEqual(Ringtail.Context);
    });
});
