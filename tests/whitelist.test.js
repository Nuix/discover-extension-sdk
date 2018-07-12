
require('../Ringtail');

const Test = require('./testLib');

describe('initialize', () => {
    test('should reject a bad domain whitelist', async () => {
        expect(Ringtail.initialize({})).rejects.toThrow('domainWhitelist must be an array of strings');
        expect(Ringtail.initialize(123)).rejects.toThrow('domainWhitelist must be an array of strings');
        expect(Ringtail.initialize('blarg')).rejects.toThrow('domainWhitelist must be an array of strings');
        expect(Ringtail.initialize([true])).rejects.toThrow('domainWhitelist must be an array of strings');
    });

    test('should accept and initialize with a valid whitelist', async () => {
        const initPromise = Ringtail.initialize(['http://ringtail.com']);
        
        expect(Test.postMessageMock).toHaveBeenCalledTimes(1);
        expect(Test.postMessageMock).toHaveBeenCalledWith({
            name: 'ExtensionReady',
            data: undefined,
            requestId: expect.any(Number),
        }, '*');

        const ackData = Test.sendUserContextMessage();

        expect(await initPromise).toEqual('http://ringtail.com');
        expect(Ringtail.Context).toEqual(ackData);

        Test.postMessageMock.mockClear();
    });

    test('should reject messages from non-whitelisted domains', async () => {
        const activeDocHandler = jest.fn().mockName('handleActiveDoc');
        console.warn = jest.fn().mockName('console.warn');
        Ringtail.on('ActiveDocument', activeDocHandler);

        Test.sendMessage({
            name: 'ActiveDocument',
            data: {}
        }, 'http://we-be-pirates.com');

        expect(activeDocHandler).toHaveBeenCalledTimes(0);
        expect(console.warn).toHaveBeenCalledTimes(1);
    });
});
