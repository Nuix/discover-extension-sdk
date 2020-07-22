
require('../Ringtail');

const Test = require('./testLib');

test('setup', async () => {
    const initPromise = Ringtail.initialize();
    Test.sendUserContextMessage();
    await initPromise;
    Test.postMessageMock.mockClear();
});

describe('setLoading',  () => {
    test('should send the LoadingMask message', async () => {
        let promise = Ringtail.setLoading(false);

        verifyMessageSent('LoadingMask', { show: false });
        await promise;

        promise = Ringtail.setLoading('SCROZZLED?');

        verifyMessageSent('LoadingMask', { show: true });
        await promise;
    });
});

describe('showNotification',  () => {
    test('should send the ShowNotification message', async () => {
        let promise = Ringtail.showNotification('error', 'an error occurred');
        verifyMessageSent('ShowNotification', { status: 'error', message: 'an error occurred' });
        await promise;
        promise = Ringtail.showNotification('warning', 'a warning occurred');
        verifyMessageSent('ShowNotification', { status: 'warning', message: 'a warning occurred' });
        await promise;
        promise = Ringtail.showNotification('success', 'saul goodman');
        verifyMessageSent('ShowNotification', { status: 'success', message: 'saul goodman' });
        await promise;
    });
});

describe('ActiveDocument', () => {
    describe('set', () => {
        test('should send the ActiveDocument_Set message', async () => {
            let promise = Ringtail.ActiveDocument.set(1234);
        
            verifyMessageSent('ActiveDocument_Set', { mainId: 1234 });

            await promise;
        });
    });

    describe('get', () => {
        test('immediately return the cached active doc info', async () => {
            let activeDoc = Ringtail.ActiveDocument.get();
            expect(activeDoc).toEqual({});

            Test.sendMessage({ name: 'ActiveDocument', data: { mainId: 42 }});

            activeDoc = Ringtail.ActiveDocument.get();
            expect(activeDoc).toEqual({ mainId: 42 });
        });
    });
});

describe('Tools', () => {
    describe('set', () => {
        test('should send the Tools_Set message', async () => {
            let promise = Ringtail.Tools.set([{ isScrozzled: true }]);
        
            verifyMessageSent('Tools_Set', [{ isScrozzled: true }]);

            await promise;
        });
    });

    describe('getValues', () => {
        test('should send the Tools_GetValues message', async () => {
            let promise = Ringtail.Tools.getValues();
        
            verifyMessageSent('Tools_GetValues', undefined, { foo: 'bar' });

            expect(await promise).toEqual({ foo: 'bar' });
        });
    });
});

describe('DocumentSelection', () => {
    describe('get', () => {
        test('should send the DocumentSelection_Get message', async () => {
            let promise = Ringtail.DocumentSelection.get();
        
            verifyMessageSent('DocumentSelection_Get');

            await promise;
        });
    });

    describe('set', () => {
        test('should send the DocumentSelection_Set message', async () => {
            let promise = Ringtail.DocumentSelection.set([1, 2]);
        
            verifyMessageSent('DocumentSelection_Set', { mainIds: [1, 2] });

            await promise;
        });
    });

    describe('select', () => {
        test('should send the DocumentSelection_Select message', async () => {
            let promise = Ringtail.DocumentSelection.select(true, [1, 2]);
        
            verifyMessageSent('DocumentSelection_Select', { mainIds: [1, 2], add: true });

            await promise;
        });
    });

    describe('selectAll', () => {
        test('should send the DocumentSelection_Set message', async () => {
            let promise = Ringtail.DocumentSelection.selectAll();
        
            verifyMessageSent('DocumentSelection_Set', { selectAll: true });

            await promise;
        });
    });
});

describe('ToolWindow', () => {
    test('should send the ToolWindow_SetOkButtonEnabled message', async () => {
        let promise = Ringtail.ToolWindow.setOkButtonEnabled(true);
        verifyMessageSent('ToolWindow_SetOkButtonEnabled', { enabled: true });
        await promise;
        promise = Ringtail.ToolWindow.setOkButtonEnabled(false);
        verifyMessageSent('ToolWindow_SetOkButtonEnabled', { enabled: false });
        await promise;
    });

    test('should send the ToolWindow_Close message', async () => {
        let promise = Ringtail.ToolWindow.close();
        verifyMessageSent('ToolWindow_Close');
        await promise;
    });

    test('should send the ResultSet_Set message', async () => {
        let promise = Ringtail.ToolWindow.loadSearchResult(1234);
        verifyMessageSent('ResultSet_Set', { searchResultId: 1234 });
        await promise;
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