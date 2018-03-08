
require('../index');

describe('RingtailSDK', () => {
    describe('initialize', () => {
        it('should return a promise that resolves once acknowledged', async () => {
            const postMessageMock = jest.spyOn(global, 'postMessage');

            const initPromise = RingtailSDK.initialize();

            expect(postMessageMock).toHaveBeenCalledTimes(1);
            expect(postMessageMock).toHaveBeenCalledWith({ name: 'ExtensionReady', data: undefined, requestId: expect.any(Number) }, '*');
        });
    });
});
    