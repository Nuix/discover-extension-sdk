
require('../index');

const Test = {};

describe('initialize', () => {
    const postMessageMock = window.parent.postMessage = jest.fn().mockName('postMessage');

    test('all API calls should throw before initialize', async () => {
        const ignoreList = new Set(['on', 'off', 'initialize']);
        const nonPromiseList = new Set(['setLoading', 'getActiveDocument']);

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
        tryCalling(RingtailSDK);
    });

    test('should return a promise that resolves once acknowledged', async () => {
        const initPromise = RingtailSDK.initialize();

        expect(postMessageMock).toHaveBeenCalledTimes(1);
        expect(postMessageMock).toHaveBeenCalledWith({
            name: 'ExtensionReady',
            data: undefined,
            requestId: expect.any(Number),
        }, '*');

        const ackData = Test.sendMessage({
            name: 'UserContext',
            data: {
                apiUrl: Test.apiUrl,
                apiKey: Test.apiKey,
                authToken: Test.authToken,
            },
            requestId: postMessageMock.mock.calls[0][0].requestId,
        }).data;

        expect(await initPromise).toEqual(ackData);
        expect(RingtailSDK.Context).toEqual(ackData);

        postMessageMock.mockClear();
    });

    test('should noop and resolve immediately if called again', async () => {
        const initPromise = RingtailSDK.initialize();

        expect(postMessageMock).toHaveBeenCalledTimes(0);
        expect(await initPromise).toEqual(RingtailSDK.Context);
    });
});


Test.apiUrl = 'http://ringtail.com/Ringtail-Svc-Portal/api/query',
Test.apiKey = '12345678-90ab-cdef-1234-567890abcdef',
Test.authToken = 'Bearer hereIsAFakeAuthTokenString01',

Test.sendMessage = message => {
    window.dispatchEvent(new MessageEvent('message', {
        origin: 'http://ringtail.com/Ringtail/',
        data: message
    }));
    return message;
};