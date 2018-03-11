
require('../index');

const Test = require('./testLib');

test('setup', async () => {
    const initPromise = RingtailSDK.initialize();
    Test.sendUserContextMessage();
    await initPromise;
    Test.postMessageMock.mockClear();
});

describe('setLoading', async () => {
    test('should send the LoadingMask message', async () => {
        let promise = RingtailSDK.setLoading(false);

        verifyMessageSent('LoadingMask', { show: false });
        await promise;

        promise = RingtailSDK.setLoading('SCROZZLED?');

        verifyMessageSent('LoadingMask', { show: true });
        await promise;
    });
});

describe('ActiveDocument', () => {
    describe('set', () => {
        test('should send the ActiveDocument_Set message', async () => {
            let promise = RingtailSDK.ActiveDocument.set(1234);
        
            verifyMessageSent('ActiveDocument_Set', { mainId: 1234 });

            await promise;
        });
    });

    describe('getValues', () => {
        test('immediately return the cached active doc info', async () => {
            let activeDoc = RingtailSDK.ActiveDocument.get();
            expect(activeDoc).toEqual({});

            Test.sendMessage({ name: 'ActiveDocument', data: { mainId: 42 }});

            activeDoc = RingtailSDK.ActiveDocument.get();
            expect(activeDoc.mainId).toBe(42);
        });
    });
});

describe('Tools', () => {
    describe('set', () => {
        test('should send the Tools_Set message', async () => {
            let promise = RingtailSDK.Tools.set([{ isScrozzled: true }]);
        
            verifyMessageSent('Tools_Set', [{ isScrozzled: true }]);

            await promise;
        });
    });

    describe('getValues', () => {
        test('should send the Tools_GetValues message', async () => {
            let promise = RingtailSDK.Tools.getValues();
        
            verifyMessageSent('Tools_GetValues', undefined, { foo: 'bar' });

            expect(await promise).toEqual({ foo: 'bar' });
        });
    });
});



async function verifyMessageSent(name, sendData, receiveData) {
    expect(Test.postMessageMock).toHaveBeenCalledTimes(1);
    expect(Test.postMessageMock).toHaveBeenCalledWith({
        name: name,
        data: sendData,
        requestId: expect.any(Number),
    }, '*');
    const reqId = Test.postMessageMock.mock.calls[0][0].requestId;
    Test.postMessageMock.mockClear();

    Test.sendMessage({ name: 'Ack', data: receiveData, requestId: reqId });
}