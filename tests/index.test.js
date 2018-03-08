
require('../index');

const Test = {};

describe('RingtailSDK', () => {
    const postMessageMock = window.parent.postMessage = jest.fn();

    describe('initialize', () => {
        it('should return a promise that resolves once acknowledged', async () => {
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
        });
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